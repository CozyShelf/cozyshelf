import BookDAO from "../dao/BookDAO";
import Book from "../domain/Book";
import PaginationDTO from "../../generic/dto/PaginationDTO";
import NoBooksFound from "./exceptions/NoBooksFound";

export default class BookService {
	public constructor(private readonly dao: BookDAO) {}

	public async getAll(page: number, limit: number): Promise<Book[]> {
		const offset = PaginationDTO.calculateOffset(page, limit);
		const bookModels = await this.dao.findAllWithPagination(limit, offset);
		return bookModels.map((bookModel) => bookModel.toEntity());
	}

	public async getById(id: string): Promise<Book> {
		const bookModel = await this.dao.findById(id);
		if (!bookModel) {
			throw new NoBooksFound(id);
		}

		return bookModel.toEntity();
	}

	public async getBookByName(name: string): Promise<Book> {
		const bookModel = await this.dao.findByName(name);
		if (!bookModel) {
			throw new NoBooksFound(name, "nome");
		}

		return bookModel.toEntity();
	}

	public async isBookInStock(
		bookId: string,
		quantity: number = 1
	): Promise<boolean> {
		const book = await this.getById(bookId);
		return book.isInStock(quantity);
	}

	public async updateBookStock(
		bookId: string,
		newStock: number
	): Promise<Book> {
		const bookModel = await this.dao.findById(bookId);
		if (!bookModel) {
			throw new NoBooksFound(bookId);
		}

		bookModel.stockQuantity = newStock;
		const updatedBookModel = await this.dao.save(bookModel);
		return updatedBookModel.toEntity();
	}

	public async decreaseBookStock(
		bookId: string,
		quantity: number
	): Promise<Book> {
		const bookModel = await this.dao.findById(bookId);
		if (!bookModel) {
			throw new NoBooksFound(bookId);
		}

		const book = bookModel.toEntity();
		book.decreaseStock(quantity);

		bookModel.stockQuantity = book.stockQuantity;
		const updatedBookModel = await this.dao.save(bookModel);
		return updatedBookModel.toEntity();
	}

	public async increaseBookStock(
		bookId: string,
		quantity: number
	): Promise<Book> {
		const bookModel = await this.dao.findById(bookId);
		if (!bookModel) {
			throw new NoBooksFound(bookId);
		}

		const book = bookModel.toEntity();
		book.increaseStock(quantity);

		bookModel.stockQuantity = book.stockQuantity;
		const updatedBookModel = await this.dao.save(bookModel);
		return updatedBookModel.toEntity();
	}
}
