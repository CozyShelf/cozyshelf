import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import CountryModel from "../../model/CountryModel";

export default class CountryDAO implements IDAO<CountryModel> {
	private repository: Repository<CountryModel>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(CountryModel);
	}

	async save(entity: CountryModel): Promise<CountryModel> {
		return await this.repository.save(entity);
	}

	async findAll(): Promise<CountryModel[] | null> {
		return await this.repository.find();
	}

	async findByAcronym(acronym: string) {
		return await this.repository.findOneBy({ acronym });
	}

	async findById(id: string): Promise<CountryModel | null> {
		return await this.repository.findOneBy({ id });
	}

	async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}
}
