import { DataSource, Repository } from "typeorm";
import IDAO from "../../generic/dao/IDAO";
import PasswordModel from "../model/PasswordModel";

export default class PasswordDAO implements IDAO<PasswordModel> {
	private repository: Repository<PasswordModel>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(PasswordModel);
	}

	async save(entity: PasswordModel): Promise<PasswordModel> {
		return await this.repository.save(entity);
	}

	findAll(): Promise<PasswordModel[] | null> {
		throw new Error("Method not implemented.");
	}

	findById(id: string): Promise<PasswordModel | null> {
		throw new Error("Method not implemented.");
	}

	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
