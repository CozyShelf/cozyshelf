import BookDAO from "../../books/dao/BookDAO";
import BookService from "../../books/service/BookService";
import GeminiService from "../../ia/service/GeminiService";
import GeminiCacheService from "../../ia/service/GeminiContextService";
import postgresDataSource from "../config/database/datasources/postgresDataSource";
import HomePageController from "../controller/HomePageController";
import IFactory from "./Factory";
import { OrderControllerFactory } from "../../order/factory/OrderControllerFactory";

export default class HomePageControllerFactory implements IFactory<HomePageController>
{
	private readonly orderFactory = new OrderControllerFactory();

	public make(): HomePageController {
		const bookService = new BookService(new BookDAO(postgresDataSource));
		
		return new HomePageController(
			bookService,
			new GeminiService(),
			new GeminiCacheService(
				this.orderFactory.makeOrderService(),
				bookService
			)
		);
	}
}
