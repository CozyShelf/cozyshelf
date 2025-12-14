import { Request, Response } from "express";
import BookService from "../../books/service/BookService";
import BookListDTO from "../../books/dto/BookListDTO";
import GeminiService from "../../ia/service/GeminiService";
import GeminiContextService from "../../ia/service/GeminiContextService";
import path from "path";

export default class HomePageController {
	private readonly BOOKS_IN_HOME_PAGE = 6;
	private readonly BOOKS_JSON_PATH = path.join(
		__dirname,
		"../../books/dao/books.json"
	);

	public constructor(
		private readonly bookService: BookService,
		private readonly aiService: GeminiService,
		private readonly contextService: GeminiContextService
	) {}

	public async renderHomePage(_: Request, res: Response) {
		try {
			const context =
				await this.contextService.prepareBookRecommendationContext(
					this.BOOKS_JSON_PATH,
					this.BOOKS_IN_HOME_PAGE
				);

			const aiResponse = await this.aiService.talkToAi(context);

			const cleanResponse = aiResponse
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "")
				.trim();

			const jsonBooks = JSON.parse(cleanResponse);

			let books = await Promise.all(
				jsonBooks.map(async (bookData: any) => {
					try {
						const book = await this.bookService.getBookByName(bookData.name);
						return book;
					} catch {
						return null;
					}
				})
			);

			books = books.filter((book) => book !== null);

			res.render("homePage", {
				title: "Seja bem vindo !",
				currentHeaderTab: "home",
				books: BookListDTO.fromEntityList(books) ?? [],
			});
		} catch (error) {
			console.warn(
				"[WARN] 🔴 Erro ao buscar recomendações de livros:",
				(error as Error).message
			);

			const books = await this.bookService.getAll(1, this.BOOKS_IN_HOME_PAGE);

			res.render("homePage", {
				title: "Seja bem vindo !",
				currentHeaderTab: "home",
				books: BookListDTO.fromEntityList(books),
			});
		}
	}
}
