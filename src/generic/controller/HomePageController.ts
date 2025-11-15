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
			const context = await this.contextService
			.prepareBookRecommendationContext(this.BOOKS_JSON_PATH);

			const prompt = `${context}\n\nRetorne APENAS um array JSON válido com ${this.BOOKS_IN_HOME_PAGE} livros interessantes e variados de diferentes categorias.`;

			const aiResponse = await this.aiService.talkToAi(prompt);

			const cleanResponse = aiResponse
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "")
				.trim();

			const books = BookListDTO.fromJSONList(JSON.parse(cleanResponse));

			res.render("homePage", {
				title: "Seja bem vindo !",
				currentHeaderTab: "home",
				books: books ?? [],
			});
		} catch (error) {
			console.error("Erro ao buscar recomendações de livros:", error);

			const books = await this.bookService.getAll(1, this.BOOKS_IN_HOME_PAGE);

			res.render("homePage", {
				title: "Seja bem vindo !",
				currentHeaderTab: "home",
				books: BookListDTO.fromEntityList(books),
			});
		}
	}
}
