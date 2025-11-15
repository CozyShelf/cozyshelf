import BookDAO from "../../books/dao/BookDAO";
import BookService from "../../books/service/BookService";
import GeminiService from "../../ia/service/GeminiService";
import GeminiCacheService from "../../ia/service/GeminiCacheService";
import postgresDataSource from "../config/database/datasources/postgresDataSource";
import HomePageController from "../controller/HomePageController";
import IFactory from "./Factory";

export default class HomePageControllerFactory
	implements IFactory<HomePageController>
{
	public make(): HomePageController {
		return new HomePageController(
			new BookService(new BookDAO(postgresDataSource)),
			new GeminiService(),
			new GeminiCacheService()
		);
	}
}
