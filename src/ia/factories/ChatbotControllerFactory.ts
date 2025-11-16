import BookDAO from "../../books/dao/BookDAO";
import BookService from "../../books/service/BookService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import { OrderControllerFactory } from "../../order/factory/OrderControllerFactory";
import ChatbotController from "../controller/ChatbotController";
import GeminiContextService from "../service/GeminiContextService";
import GeminiService from "../service/GeminiService";

export default class ChatbotControllerFactory
	implements IFactory<ChatbotController>
{
	private readonly orderFactory = new OrderControllerFactory();

	public make(): ChatbotController {
		const bookService = new BookService(new BookDAO(postgresDataSource));
		const aiService = new GeminiService();
		const contextService = new GeminiContextService(
			this.orderFactory.makeOrderService(),
			bookService
		);

		return new ChatbotController(contextService, aiService, bookService);
	}
}
