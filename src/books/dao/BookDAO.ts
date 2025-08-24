import IDAO from "../../generic/dao/IDAO";
import Book from "../domain/Book";
import path from "path";
import fs from "fs";

export default class BookDAO implements IDAO<Book> {
	save(entity: Book): Promise<Book> {
		throw new Error("Method not implemented.");
	}

	async findAll(): Promise<Book[] | null> {
		const jsonFilePath: string = path.join(__dirname, "/books.json");
		return JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
	}

	async findAllWithPagination(limit: number, offset: number) {
		const books = await this.findAll();

		if (!books || offset >= books?.length) {
			return [];
		}

		return books.slice(offset, offset + limit);
	}

	findById(id: string): Promise<Book | null> {
		throw new Error("Method not implemented.");
	}

	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
