import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import OrderModel from "../../model/OrderModel";

export default class OrderDAO implements IDAO<OrderModel> {
	private repository: Repository<OrderModel>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(OrderModel);
	}

	public async save(order: OrderModel): Promise<OrderModel> {
		const savedOrder = await this.repository.save(order);
		const completeOrder = await this.findById(savedOrder.id);
		return completeOrder!;
	}

	async findAll(): Promise<OrderModel[]> {
		return await this.repository.find({
			relations: [
				"client",
				"items",
				"delivery",
				"payment",
				"payment.paymentCards",
				"payment.paymentCards.card",
				"payment.paymentCards.card.cardFlag",
				"freight",
			],
		});
	}

	async findById(id: string): Promise<OrderModel | null> {
		return await this.repository.findOne({
			where: { id },
			relations: [
				"client",
				"items",
				"delivery",
				"payment",
				"payment.paymentCards",
				"payment.paymentCards.card",
				"payment.paymentCards.card.cardFlag",
				"freight",
			],
		});
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}
}
