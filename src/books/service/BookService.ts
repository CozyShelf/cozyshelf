import BookDAO from "../dao/BookDAO";
import Book from "../domain/Book";
import PaginationDTO from "../../generic/dto/PaginationDTO";

export default class BookService {
	public constructor(private readonly dao: BookDAO) {}

	public async getAll(page: number, limit: number): Promise<Book[]> {
		const offset = PaginationDTO.calculateOffset(page, limit);
		return await this.dao.findAllWithPagination(limit, offset);
	}
}
