import { Request, Response } from "express";
import ICRUDController from "../../generic/controller/ICRUDController";
import BookService from "../service/BookService";
import Book from "../domain/Book";

export default class BookController implements ICRUDController<Book> {
	private readonly service: BookService;

	constructor(service: BookService) {
		this.service = service;
	}

	create(req: Request, res: Response): Promise<Book> {
		throw new Error("Method not implemented.");
	}

	async getAll(req: Request, res: Response): Promise<Book[] | null> {
		return await this.service.getAll();
	}

	getById(req: Request, res: Response): Promise<Book | null> {
		throw new Error("Method not implemented.");
	}

	update(req: Request, res: Response): Promise<Book | null> {
		throw new Error("Method not implemented.");
	}

	delete(req: Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
