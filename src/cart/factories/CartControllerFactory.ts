import { AddressControllerFactory } from "../../address/factories/AddressControllerFactory";
import BookDAO from "../../books/dao/BookDAO";
import BookService from "../../books/service/BookService";
import { CardControllerFactory } from "../../card/factories/CardControllerFactory";
import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import { CouponDAO } from "../../coupons/dao/typeORM/CouponDAO";
import { CouponControllerFactory } from "../../coupons/factories/CouponControllerFactory";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import CartController from "../controller/CartController";
import CartDAO from "../dao/CartDAO";
import CartService from "../service/CartService";

export default class CartControllerFactory implements IFactory<CartController> {
	private cardControllerFactory: CardControllerFactory;
	private addressControllerFactory: AddressControllerFactory;
	private couponContollerFactory: CouponControllerFactory

	public constructor() {
		this.cardControllerFactory = new CardControllerFactory();
		this.addressControllerFactory = new AddressControllerFactory();
		this.couponContollerFactory = new CouponControllerFactory();
	}

	public make() {
		const clientDAO = new ClientDAO(postgresDataSource);
		const bookDAO = new BookDAO(postgresDataSource);
		const couponDAO = new CouponDAO(postgresDataSource);

		return new CartController(
			new CartService(
				new CartDAO(postgresDataSource),
				clientDAO,
				bookDAO,
				new BookService(bookDAO)
			),
			this.cardControllerFactory.makeCardService(clientDAO),
			this.addressControllerFactory.makeAddressService(clientDAO),
			this.couponContollerFactory.makeCouponService(couponDAO)
		);
	}
}
