import { AddressControllerFactory } from "../../address/factories/AddressControllerFactory";
import BookDAO from "../../books/dao/BookDAO";
import BookService from "../../books/service/BookService";
import { CardControllerFactory } from "../../card/factories/CardControllerFactory";
import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import CartController from "../controller/CartController";
import CartDAO from "../dao/CartDAO";
import CartService from "../service/CartService";

export default class CartControllerFactory implements IFactory<CartController> {
	private cardControllerFactory: CardControllerFactory;
	private addressControllerFactory: AddressControllerFactory;

	public constructor() {
		this.cardControllerFactory = new CardControllerFactory();
		this.addressControllerFactory = new AddressControllerFactory();
	}

	public make() {
		const clientDAO = new ClientDAO(postgresDataSource);
		const bookDAO = new BookDAO(postgresDataSource);

		return new CartController(
			new CartService(
				new CartDAO(postgresDataSource),
				clientDAO,
				bookDAO,
				new BookService(bookDAO)
			),
			this.cardControllerFactory.makeCardService(clientDAO),
			this.addressControllerFactory.makeAddressService(clientDAO)
		);
	}
}
