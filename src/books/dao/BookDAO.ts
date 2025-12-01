import IDAO from "../../generic/dao/IDAO";
import { DataSource, Repository } from "typeorm";
import BookModel from "../model/BookModel";

export default class BookDAO implements IDAO<BookModel> {
	private repository: Repository<BookModel>;

	public constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(BookModel);
	}

	async save(entity: BookModel): Promise<BookModel> {
		return await this.repository.save(entity);
	}

	async findAll(): Promise<BookModel[] | null> {
		return this.repository.findBy({ isActive: true });
	}

	async findAllWithPagination(limit: number, offset: number) {
		const books = await this.findAll();

		if (!books || offset >= books?.length) {
			return [];
		}

		return books.slice(offset, offset + limit);
	}

	findById(id: string): Promise<BookModel | null> {
		return this.repository.findOneBy({ id, isActive: true });
	}

	findByName(name: string): Promise<BookModel | null> {
		return this.repository.findOneBy({ title: name, isActive: true });
	}

	delete(_: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
