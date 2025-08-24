import BookDAO from "../dao/BookDAO";
import Book from "../domain/Book";
import PaginationDTO from "../../generic/dto/PaginationDTO";

export default class BookService {
	public constructor(private readonly dao: BookDAO) {}

	public async getAll(page: number, limit: number): Promise<Book[]> {
		const offset = PaginationDTO.calculateOffset(page, limit);
		return await this.dao.findAllWithPagination(limit, offset);
	}

	public async getById(id: number): Promise<Book> {
		const book = await this.dao.findById(id);

		if (!book) {
			throw new Error(`Book with id: ${id} was not found`);
		}

		return book;
	}

	public async getById(id: string): Promise<Book | null> {
		return new Book(
				"Crepúsculo",
				"Stephenie Meyer",
				"/assets/book-covers/crepusculo.png",
				34.9,
				3.9
			);
	}
}
