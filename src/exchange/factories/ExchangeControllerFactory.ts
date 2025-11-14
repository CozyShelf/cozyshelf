import IFactory from "../../generic/factories/Factory";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import { DataSource } from "typeorm";
import ExchangeController from "../controller/ExchangeController";
import ExchangeDAO from "../dao/typeORM/ExchangeDAO";
import { ExchangeService } from "../service/ExchangeService";
import { OrderControllerFactory } from "../../order/factory/OrderControllerFactory";

export class ExchangeControllerFactory implements IFactory<ExchangeController> {
    private exchangeDAO = this.makeExchangeDAO(postgresDataSource);
    private exchangeService = this.makeExchangeService(this.exchangeDAO);

    public make(): ExchangeController {
        return new ExchangeController(this.exchangeService);
    }

    public makeExchangeService(exchangeDAO: ExchangeDAO): ExchangeService {
        return new ExchangeService(exchangeDAO,
            new OrderControllerFactory().makeOrderService(),
            new OrderControllerFactory().makeBookService(),
            new OrderControllerFactory().makeCouponService()
        );
    }

    public makeExchangeDAO(postgresDataSource: DataSource): ExchangeDAO {
        return new ExchangeDAO(postgresDataSource);
    }
}