import IFactory from "../../generic/factories/Factory";
import OrderController from "../controller/OrderController";
import OrderDAO from "../dao/typeORM/OrderDAO";
import { OrderService } from "../service/OrderService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import BookService from "../../books/service/BookService";
import BookDAO from "../../books/dao/BookDAO";


export class OrderControllerFactory implements IFactory<OrderController> {

    public make(): OrderController {
        return new OrderController(this.makeOrderService(), this.makeBookService());
    }

    public makeOrderService(): any {
        return new OrderService(this.makeOrderDAO());
    }

    public makeOrderDAO(): OrderDAO {
        return new OrderDAO(postgresDataSource);
    }

    public makeBookService(): BookService{
        return new BookService(new BookDAO(postgresDataSource));
    }
}
