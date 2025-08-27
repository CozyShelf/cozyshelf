import IFactory from "../../generic/factories/Factory";
import BookController from "../controller/BookController";
import BookDAO from "../dao/BookDAO";
import BookService from "../service/BookService";

export class BookControllerFactory implements IFactory<BookController> {
	public make(): BookController {
		return new BookController(
			new BookService(
				new BookDAO()
			)
		)
	}
}
