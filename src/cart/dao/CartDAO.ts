import { DataSource, Repository } from "typeorm";
import IDAO from "../../generic/dao/IDAO";
import CartItemModel from "../model/CartItemModel";

export default class CartDAO implements IDAO<CartItemModel> {
	private repository: Repository<CartItemModel>;

	public constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(CartItemModel);
	}

	async save(entity: CartItemModel): Promise<CartItemModel> {
		return await this.repository.save(entity);
	}

	async findAll(): Promise<CartItemModel[] | null> {
		return await this.repository.find({
			where: { isActive: true },
			relations: ["client", "book"],
		});
	}

	async findAllByClientID(clientID: string): Promise<CartItemModel[]> {
		return await this.repository.find({
			where: {
				client: { id: clientID },
				isActive: true,
			},
			relations: ["client", "book"],
		});
	}

	async findByClientAndBookID(
		clientID: string,
		bookID: string
	): Promise<CartItemModel | null> {
		return await this.repository.findOne({
			where: {
				client: { id: clientID },
				book: { id: bookID },
				isActive: true,
			},
			relations: ["client", "book"],
		});
	}

	async findById(id: string): Promise<CartItemModel | null> {
		return await this.repository.findOne({
			where: { id },
			relations: ["client", "book"],
		});
	}

	async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}

	async deleteAllByClientID(clientID: string): Promise<void> {
		await this.repository.update(
			{ client: { id: clientID }, isActive: true },
			{ isActive: false }
		);
	}
}
