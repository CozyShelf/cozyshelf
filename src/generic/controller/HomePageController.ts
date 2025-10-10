import { Request, Response } from "express";
import BookService from "../../books/service/BookService";
import BookListDTO from "../../books/dto/BookListDTO";

export default class HomePageController {
	private readonly BOOKS_IN_HOME_PAGE = 6;

	public constructor(private readonly bookService: BookService) { }

	public async renderHomePage(_: Request, res: Response) {
		const books = await this.bookService.getAll(1, this.BOOKS_IN_HOME_PAGE);

		res.render("homePage", {
			title: "Seja bem vindo !",
			currentHeaderTab: "home",
			books: books ? BookListDTO.fromEntityList(books) : [],
		});
	}
}
