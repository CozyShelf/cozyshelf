import { Request, Response } from "express";
import BookService from "../service/BookService";
import Book from "../domain/Book";
import BookListDTO from "../dto/BookListDTO";
import BookDetailsDTO from "../dto/BookDetailsDTO";
import BookAdminDTO from "../dto/BookAdminDTO";

export default class BookController {
	private readonly service: BookService;
	private readonly DEFAULT_PAGINATION_PAGE = 1;
	private readonly DEFAULT_PAGINATION_LIMIT = 6;

	constructor(service: BookService) {
		this.service = service;
	}

	create(_req: Request, _res: Response): Promise<Book> {
		throw new Error("Method not implemented.");
	}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const page = Number(req.query.page) || this.DEFAULT_PAGINATION_PAGE;
			const limit = Number(req.query.limit) || this.DEFAULT_PAGINATION_LIMIT;

			const books = await this.service.getAll(page, limit);

			res.status(200).json({
				message: `${books.length} livros encontrados!`,
				count: books.length,
				data: books ? BookListDTO.fromEntityList(books) : [],
			});
		} catch (error) {
			res.status(400).json({
				message: (error as Error).message,
			});
		}
	}

	async getById(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const book = await this.service.getById(id);
			res.status(200).json({
				message: `Dados do livro carregados com sucesso!`,
				data: BookDetailsDTO.fromEntity(book),
			});
		} catch (error) {
			res.status(400).json({
				message: (error as Error).message,
			});
		}
	}

	update(_req: Request, _res: Response): Promise<Book | null> {
		throw new Error("Method not implemented.");
	}

	delete(_req: Request, _res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async renderBooksForStock(req: Request, res: Response) {
		const page = Number(req.query.page) || this.DEFAULT_PAGINATION_PAGE;
		const limit = Number(req.query.limit) || this.DEFAULT_PAGINATION_LIMIT;

		const books = await this.service.getAll(page, limit);

		res.render("stockTable", {
			title: "Estoque",
			currentHeaderTab: "profile",
			layout: "defaultLayoutAdmin",
			currentUrl: "stock",
			isAdmin: true,
			books: books ? BookAdminDTO.fromEntityList(books) : [],
		});
	}

	async renderBooksForDashboard(req: Request, res: Response) {
		const page = Number(req.query.page) || this.DEFAULT_PAGINATION_PAGE;
		const limit = Number(req.query.limit) || this.DEFAULT_PAGINATION_LIMIT;

		const books = await this.service.getAll(page, limit);
		const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

		const booksForChart = books ? BookAdminDTO.fromEntityList(books) : [];
		const salesHistory = booksForChart.map((book) => {
			const sales = labels.map(() => Math.floor(Math.random() * 50) + 10);
			return {
				label: book.name,
				data: sales,
				fill: false,
				borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				tension: 0.3,
			};
		});

		res.render("dashboard", {
			title: "Dashboard - Grafico de linha de vendas",
			currentHeaderTab: "profile",
			layout: "defaultLayoutAdmin",
			currentUrl: "dashboard",
			isAdmin: true,
			books: booksForChart,
			labels,
			salesHistory,
		});
	}

	async renderAllBooksWithPagination(req: Request, res: Response) {
		const page = Number(req.query.page) || this.DEFAULT_PAGINATION_PAGE;
		const limit = Number(req.query.limit) || this.DEFAULT_PAGINATION_LIMIT;

		const books = await this.service.getAll(page, limit);

		res.render("listAllBooks", {
			title: "Explore nosso catálogo",
			currentHeaderTab: "books",
			books: books ? BookListDTO.fromEntityList(books) : [],
		});
	}

	async renderBookDetails(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const book = await this.service.getById(id);

			res.render("bookDetails", {
				title: `Detalhes do livro - ${book.name}`,
				currentHeaderTab: "books",
				book: BookDetailsDTO.fromEntity(book),
			});
		} catch (error) {
			res.status(400).json({
				message: (error as Error).message,
			});
		}
	}
}
