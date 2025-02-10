import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Types } from "../../di/types";
import { IOrderRepository } from "../../domain/repositories/order.repository";
import { IOrderDetailRepository } from "../../domain/repositories/orderDetail.repository";
import { IPackageRepository } from "../../domain/repositories/package.repository";
import { CreatePackageDTO } from "../../domain/entities/package.entity";
import { sumWeight } from "../../domain/services/orders.service";
import { OrderStatus } from "../../domain/entities/orderDetails.entity";

@injectable()
export class OrdersController {
	constructor(
		@inject(Types.IOrderRepository) private orderRepository: IOrderRepository,
		@inject(Types.IOrderDetailRepository) private orderDetailRepository: IOrderDetailRepository,
		@inject(Types.IPackageRepository) private packageRepository: IPackageRepository
	) { }

    create = async (req: Request, res: Response) => {
		const { recipientAddress, recipientName, recipientPhoneNumber, packages } = req.body;
		if (!req.user) {
			return res.status(400).send("User not authenticated");
		}
		const userId = req.user.id;
		const totalWeight = sumWeight(packages);
		const order = await this.orderRepository.create({ recipientAddress, recipientName, recipientPhoneNumber, totalWeight, userId });
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
}
