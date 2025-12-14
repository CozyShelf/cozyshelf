import IFactory from "../../generic/factories/Factory";
import OrderController from "../controller/OrderController";
import OrderDAO from "../dao/typeORM/OrderDAO";
import { OrderService } from "../service/OrderService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import BookService from "../../books/service/BookService";
import BookDAO from "../../books/dao/BookDAO";
import CartService from "../../cart/service/CartService";
import CartDAO from "../../cart/dao/CartDAO";
import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import { CouponDAO } from "../../coupons/dao/typeORM/CouponDAO";
import { CouponService } from "../../coupons/service/CouponsService";
import ExchangeDAO from "../../exchange/dao/typeORM/ExchangeDAO";
import { ExchangeService } from "../../exchange/service/ExchangeService";
import BookSaleService from "../../books/service/BookSaleService";
import BookSaleDAO from "../../books/dao/BookSaleDAO";


export class OrderControllerFactory implements IFactory<OrderController> {

    public make(): OrderController {
        return new OrderController(this.makeOrderService(), this.makeBookService(), this.makeExchangeService());
    }

	public makeOrderService(): any {
		return new OrderService(
			this.makeOrderDAO(),
			this.makeCartService(),
			this.makeCouponService(),
			this.makeBookService(),
			this.makeBookSaleService()
		);
	}

	public makeOrderDAO(): OrderDAO {
		return new OrderDAO(postgresDataSource);
	}

	public makeBookService(): BookService {
		return new BookService(new BookDAO(postgresDataSource));
	}

	public makeBookSaleService(): BookSaleService {
		return new BookSaleService(
			new BookSaleDAO(postgresDataSource),
			new BookDAO(postgresDataSource)
		);
	}

	public makeCartService(): CartService {
		return new CartService(
			new CartDAO(postgresDataSource),
			new ClientDAO(postgresDataSource),
			new BookDAO(postgresDataSource)
		);
	}

    public makeCouponService(): CouponService {
        return new CouponService(new CouponDAO(postgresDataSource));
    }

    public makeExchangeService(): any {
        return new ExchangeService(
            new ExchangeDAO(postgresDataSource),
            this.makeOrderService(),
            this.makeBookService(),
            this.makeCouponService()
        );
    }
}
