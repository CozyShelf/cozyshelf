import { Request, Response } from "express";
import BookService from "../service/BookService";
import Book from "../domain/Book";

export default class BookController {
	private readonly service: BookService;
	private readonly DEFAULT_PAGINATION_PAGE = 1;
	private readonly DEFAULT_PAGINATION_LIMIT = 6;

	constructor(service: BookService) {
		this.service = service;
	}

	create(req: Request, res: Response): Promise<Book> {
		throw new Error("Method not implemented.");
	}

	async getAll(req: Request, res: Response): Promise<Book[] | null> {
		const page = Number(req.query.page) || this.DEFAULT_PAGINATION_PAGE;
		const limit = Number(req.query.limit ) || this.DEFAULT_PAGINATION_LIMIT;

		return await this.service.getAll(page, limit);
	}

	async getById(req: Request, res: Response): Promise<Book> {
		const id = parseInt(req.params.id, 10);
		return await this.service.getById(id);
	}

	update(req: Request, res: Response): Promise<Book | null> {
		throw new Error("Method not implemented.");
	}

	delete(req: Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
