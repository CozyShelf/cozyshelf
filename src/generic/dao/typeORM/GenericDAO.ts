import { DataSource, Repository } from "typeorm";
import IDAO from "../IDAO";
import GenericModel from "../../model/GenericModel";

export class GenericDAO<T extends GenericModel> implements IDAO<T> {
	private repository: Repository<T>;

	constructor(dataSource: DataSource, entity: { new (): T }) {
		this.repository = dataSource.getRepository(entity);
	}

	async save(entity: T): Promise<T> {
		return await this.repository.save(entity);
	}

	async findAll(): Promise<T[] | null> {
		return await this.repository.find();
	}

	async findById(id: string): Promise<T | null> {
		return await this.repository.findOne({ where: { id } as any });
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}
}
