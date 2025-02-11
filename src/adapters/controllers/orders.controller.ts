import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Types } from "../../di/types";
import { IOrderRepository } from "../../domain/repositories/order.repository";
import { IOrderDetailRepository } from "../../domain/repositories/orderDetail.repository";
import { IPackageRepository } from "../../domain/repositories/package.repository";
import { CreatePackageDTO } from "../../domain/entities/package.entity";
import { sumWeight, validateAddress } from "../../domain/services/orders.service";
import { OrderStatus } from "../../domain/entities/orderDetails.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IVehicleRepository } from "../../domain/repositories/vehicle.repository";
import { IRouteRepository } from "../../domain/repositories/route.repository";

@injectable()
export class OrdersController {
	constructor(
		@inject(Types.IOrderRepository) private orderRepository: IOrderRepository,
		@inject(Types.IOrderDetailRepository) private orderDetailRepository: IOrderDetailRepository,
		@inject(Types.IPackageRepository) private packageRepository: IPackageRepository,
		@inject(Types.IUserRepository) private userRepository: IUserRepository,
		@inject(Types.IVehicleRepository) private vehicleRepository: IVehicleRepository,
		@inject(Types.IRouteRepository) private routeRepository: IRouteRepository
	) { }

	create = async (req: Request, res: Response) => {
		const { originCity, recipientAddress, recipientCity, recipientPostalCode, recipientName, recipientPhoneNumber, packages } = req.body;
		const address = `${recipientAddress} ${recipientCity} ${recipientPostalCode}`.replace(/ /g, "+");
		const isValidAddress = await validateAddress(address);
		const isInvalidPackages = packages.some((p: CreatePackageDTO) =>
			p.weight <= 0 || p.width <= 0 || p.height <= 0 || p.depth <= 0 || p.weight > 1000 ||
			p.width > 2 || p.height > 2 || p.depth > 2
		);
		const validateAllProperties = packages.every((p: CreatePackageDTO) =>
			p.weight && p.width && p.height && p.depth && p.kind
		);
		if (isInvalidPackages || !validateAllProperties) {
			return res.status(400).send("Invalid packages");
		}
		if (!isValidAddress) {
			return res.status(400).send("Invalid address");
		}
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const userId = req.user.id;
		const totalWeight = sumWeight(packages);
		const payload = {
			originCity,
			recipientAddress,
			recipientCity,
			recipientPostalCode,
			recipientName,
			recipientPhoneNumber,
			totalWeight,
			userId
		}
		const order = await this.orderRepository.create(payload);
		if (!order) {
			return res.status(500).send("Order creation failed");
		}

		const packagesResponse = await Promise.all(packages.map(async (p: CreatePackageDTO) => {
			const packageResponse = await this.packageRepository.create({ ...p, orderId: order.id });
			return packageResponse;
		}));

		const orderDetailResponse = await this.orderDetailRepository.create({ orderId: order.id, status: OrderStatus.PENDING });
		if (!orderDetailResponse) {
			return res.status(500).send("Order creation failed");
		}

		const response = {
			...order,
			packages: packagesResponse,
			orderDetail: orderDetailResponse
		}

		return res.status(201).send(response);

	}

	findByNumber = async (req: Request, res: Response) => {
		const orderNumber = req.params.orderNumber;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const order = await this.orderRepository.findByNumber(orderNumber);
		if (!order?.id) {
			return res.status(404).send("Order not found");
		}
		const packages = await this.packageRepository.findByOrderId(order.id);
		const orderDetail = await this.orderDetailRepository.findByOrderId(order.id);

		const response = {
			...order,
			packages,
			orderDetail
		}

		return res.status(200).send(response);
	}

	findStatusByNumber = async (req: Request, res: Response) => {
		const orderNumber = req.params.orderNumber;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const order = await this.orderRepository.findByNumber(orderNumber);
		if (!order?.id) {
			return res.status(404).send("Order not found");
		}
		const orderDetail = await this.orderDetailRepository.findByOrderId(order.id);
		const response = orderDetail.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			.map((o) => {
				return {
					status: o.status,
					createdAt: o.createdAt
				}
			});
		return res.status(200).send(response);
	}

	assignOrder = async (req: Request, res: Response) => {
		const { orderNumber } = req.body;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const order = await this.orderRepository.findByNumber(orderNumber);
		if (!order?.id) {
			return res.status(404).send("Order not found");
		}
		const driver = await this.userRepository.getDrivers({ currentLocation: order.originCity });
		if (!driver.length) {
			return res.status(404).send("No drivers available");
		}

		const vehicle = await this.vehicleRepository.getAvailableVehicle({ currentLocation: order.originCity });
		if (!vehicle.length) {
			return res.status(404).send("No vehicles available");
		}

		const route = await this.routeRepository.findByOriginAndDestination(order.originCity, order.recipientCity);
		if (!route?.length) {
			return res.status(404).send("No route available");
		}

		const selectRoute = route.sort((a, b) => a.distance - b.distance).pop();
		const driverId = driver[0]?.id;
		const vehicleId = vehicle[0]?.id;
		const orderResponse = await this.orderRepository.update({ ...order, routeId: selectRoute?.id });

		if (!orderResponse) {
			return res.status(500).send("Order assignation failed");
		}

		// update route with driver and vehicle
		if (!selectRoute?.id) {
			return res.status(404).send("Route ID not found");
		}
		const routeResponse = await this.routeRepository.update({ ...selectRoute, driverId, vehicleId, id: selectRoute.id });

		if (!routeResponse) {
			return res.status(500).send("Route assignation failed");
		}

		const orderDetail = await this.orderDetailRepository.findByOrderId(order.id);
		const lastOrderDetail = orderDetail.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).pop();
		if (lastOrderDetail?.status !== OrderStatus.PENDING) {
			return res.status(400).send("Order not pending");
		}
		const orderDetailResponse = await this.orderDetailRepository.create({ orderId: order.id, status: OrderStatus.IN_PROGRESS });
		if (!orderDetailResponse) {
			return res.status(500).send("Order assignation failed");
		}
		
		const response = {
			route: routeResponse,
			orderDetail: orderDetailResponse
		}
		return res.status(200).send(response);
	}

	finishOrder = async (req: Request, res: Response) => {
		const { orderNumber } = req.body;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const order = await this.orderRepository.findByNumber(orderNumber);
		if (!order?.id) {
			return res.status(404).send("Order not found");
		}
		const orderDetail = await this.orderDetailRepository.findByOrderId(order.id);
		const lastOrderDetail = orderDetail.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).pop();
		if (lastOrderDetail?.status !== OrderStatus.IN_PROGRESS) {
			return res.status(400).send("Order not in progress");
		}
		const orderDetailResponse = await this.orderDetailRepository.create({ orderId: order.id, status: OrderStatus.COMPLETED });
		if (!orderDetailResponse) {
			return res.status(500).send("Order finish failed");
		}

		/*
		if (!order.routeId) {
			return res.status(400).send("Route ID not found");
		}
		const route = await this.routeRepository.findById(order.routeId);
		if (!route?.id || !route.driverId || !route.vehicleId) {
			return res.status(404).send("Route ID not found");
		}
		const driver = await this.userRepository.findById(route.driverId);
		const vehicle = await this.vehicleRepository.findById(route.vehicleId);

		if (!driver?.id || !vehicle?.id) {
			return res.status(404).send("Driver or vehicle not found");
		}

		const driverResponse = await this.userRepository.update({ ...driver, currentLocation: order.recipientCity });
		const vehicleResponse = await this.vehicleRepository.update({ ...vehicle, currentLocation: order.recipientCity });

		if (!driverResponse || !vehicleResponse) {
			return res.status(500).send("Driver or vehicle update failed");
		}
		*/
		
		const response = {
			orderDetail: orderDetailResponse
		}
		return res.status(200).send(response);
	}
}
