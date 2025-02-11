import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Types } from "../../di/types";
import { IOrderRepository } from "../../domain/repositories/order.repository";
import { IOrderDetailRepository } from "../../domain/repositories/orderDetail.repository";
import { IPackageRepository } from "../../domain/repositories/package.repository";
import { CreatePackageDTO } from "../../domain/entities/package.entity";
import { sumWeight, validateAddress } from "../../domain/services/orders.service";
import { OrderStatus } from "../../domain/entities/orderDetails.entity";

@injectable()
export class OrdersController {
	constructor(
		@inject(Types.IOrderRepository) private orderRepository: IOrderRepository,
		@inject(Types.IOrderDetailRepository) private orderDetailRepository: IOrderDetailRepository,
		@inject(Types.IPackageRepository) private packageRepository: IPackageRepository
	) { }

	create = async (req: Request, res: Response) => {
		const { recipientAddress, recipientCity, recipientPostalCode, recipientName, recipientPhoneNumber, packages } = req.body;
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
		const order = await this.orderRepository.create({ recipientAddress, recipientCity, recipientPostalCode, recipientName, recipientPhoneNumber, totalWeight, userId });
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

		return res.status(201).send({ order, packages: packagesResponse, orderDetail: orderDetailResponse });

	}

	findByNumber = async (req: Request, res: Response) => {
		const numberOrder = req.params.numberOrder;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const order = await this.orderRepository.findByNumber(numberOrder);
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
		const numberOrder = req.params.numberOrder;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const order = await this.orderRepository.findByNumber(numberOrder);
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
}
