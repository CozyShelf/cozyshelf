import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import CreditCardModel from "../../model/CreditCardModel";

export class CardDAO implements IDAO<CreditCardModel> {
	private dataSource: DataSource;
	private repository: Repository<CreditCardModel>;

	constructor(dataSource: DataSource) {
		this.dataSource = dataSource;
		this.repository = this.dataSource.getRepository(CreditCardModel);
	}

	public async save(client: CreditCardModel): Promise<CreditCardModel> {
		return await this.repository.save(client);
	}

	public async findAll(): Promise<CreditCardModel[] | null> {
		return await this.repository.find();
	}

	public async findById(id: string): Promise<CreditCardModel | null> {
		return await this.repository.findOne({ where: { id } });
	}

	public async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}
}
