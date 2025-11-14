import { Request, Response } from "express";
import BookService from "../service/BookService";
import BookSaleService from "../service/BookSaleService";
import Book from "../domain/Book";
import BookListDTO from "../dto/BookListDTO";
import BookDetailsDTO from "../dto/BookDetailsDTO";
import BookAdminDTO from "../dto/BookAdminDTO";

export default class BookController {
	private readonly service: BookService;
	private readonly bookSaleService: BookSaleService;
	private readonly DEFAULT_PAGINATION_PAGE = 1;
	private readonly DEFAULT_PAGINATION_LIMIT = 6;

	constructor(service: BookService, bookSaleService: BookSaleService) {
		this.service = service;
		this.bookSaleService = bookSaleService;
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
		const limit = Number(req.query.limit) || this.DEFAULT_PAGINATION_LIMIT;
		const viewType = (req.query.viewType as string) || "books";

		if (!req.query.startDate || !req.query.endDate) {
			res.render("dashboard", {
				title: "Dashboard - Grafico de linha de vendas",
				currentHeaderTab: "profile",
				layout: "defaultLayoutAdmin",
				currentUrl: "dashboard",
				isAdmin: true,
				books: [],
				labels: [],
				salesHistory: [],
				hasData: false,
				needsDateSelection: true,
				viewType,
			});
			return;
		}

		const endDate = this.parseLocalDate(req.query.endDate as string);
		const startDate = this.parseLocalDate(req.query.startDate as string);
		const labels = this.generateMonthLabels(startDate, endDate);

		let salesHistory: any[] = [];
		let hasData = false;

		if (viewType === "categories") {
			const categoryChartData =
				await this.bookSaleService.getSalesChartDataByCategory(
					startDate,
					endDate,
					labels
				);

			salesHistory = categoryChartData.datasets;
			hasData = categoryChartData.hasData;
		} else {
			const bookChartData = await this.bookSaleService.getSalesChartDataByBook(
				startDate,
				endDate,
				labels,
				limit
			);

			salesHistory = bookChartData.datasets;
			hasData = bookChartData.hasData;
		}

		res.render("dashboard", {
			title: "Dashboard - Grafico de linha de vendas",
			currentHeaderTab: "profile",
			layout: "defaultLayoutAdmin",
			currentUrl: "dashboard",
			isAdmin: true,
			labels,
			salesHistory,
			hasData,
			viewType,
		});
	}

	private generateMonthLabels(startDate: Date, endDate: Date): string[] {
		const monthNames = [
			"Jan",
			"Fev",
			"Mar",
			"Abr",
			"Mai",
			"Jun",
			"Jul",
			"Ago",
			"Set",
			"Out",
			"Nov",
			"Dez",
		];
		const labels: string[] = [];
		const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
		const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

		while (current <= end) {
			labels.push(`${monthNames[current.getMonth()]}/${current.getFullYear()}`);
			current.setMonth(current.getMonth() + 1);
		}

		return labels;
	}

	private parseLocalDate(dateString: string): Date {
		const [year, month, day] = dateString.split("-").map(Number);
		return new Date(year, month - 1, day);
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
