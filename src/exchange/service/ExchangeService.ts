import BookService from "../../books/service/BookService";
import { OrderService } from "../../order/service/OrderService";
import ExchangeDAO from "../dao/typeORM/ExchangeDAO";
import Exchange from "../domain/Exchange";
import ItemExchange from "../domain/ItemExchange";
import ExchangeModel from "../model/ExchangeModel";
import OrderStatus from "../../order/domain/enums/OrderStatus";
import { CouponService } from "../../coupons/service/CouponsService";
import IExchangeBooksStock from "../dto/IExchangeBooksStock";

export class ExchangeService {
    constructor(
        private readonly exchangeDAO: ExchangeDAO,
        private readonly orderService: OrderService,
        private readonly bookService: BookService,
        private readonly couponService: CouponService
    ) {}

    public async create(exchange: Exchange): Promise<Exchange> {
        const exchangeModel = ExchangeModel.fromEntity(exchange);

        // Validate that the order exists and is in correct status for exchange
        await this.validateOrderForExchange(exchange.orderId);

        // Validate exchange items against the original order
        await this.validateExchangeItems(exchange.orderId, exchange.exchangeItems);

        const createdExchangeModel = await this.exchangeDAO.save(exchangeModel);
        const createdExchange = createdExchangeModel.toEntity();

        await this.orderService.updateStatus(exchange.orderId, 'IN_EXCHANGE');

        return createdExchange;
    }

    public async confirmExchange(orderId: string, returnItemsStock: IExchangeBooksStock[]): Promise<Exchange> {
        const exchangeModel = await this.exchangeDAO.findByOrderId(orderId).then(exchanges => exchanges[0]);

        if (!exchangeModel) {
            throw new Error(`Exchange with order id: ${orderId} not found.`);
        }

        // Return books to stock as per returnItemsStock
        for (const item of returnItemsStock) {
            await this.bookService.increaseBookStock(item.bookId, item.quantity);
        }

        await this.orderService.updateStatus(exchangeModel.orderId, 'EXCHANGED');
        await this.exchangeDAO.save(exchangeModel);

        await this.couponService.createExchangeCouponForExcessValue(
            (await this.orderService.getById(exchangeModel.orderId))!.clientId,
            exchangeModel.exchangeItemsTotal
        );

        return exchangeModel.toEntity();
    }

    public async getById(id: string): Promise<Exchange | null> {
        const exchangeModel = await this.exchangeDAO.findById(id);

        if (!exchangeModel) {
            return null;
        }
        return exchangeModel.toEntity();
    }

    public async getByOrderId(orderId: string): Promise<Exchange[]> {
        const exchangeModels = await this.exchangeDAO.findByOrderId(orderId);
        return exchangeModels.map(model => model.toEntity());
    }

    public async getAll(): Promise<Exchange[]> {
        const exchangeModels = await this.exchangeDAO.findAll();
        if (!exchangeModels) {
            return [];
        }
        return exchangeModels.map(exchangeModel => exchangeModel.toEntity());
    }

    public async delete(id: string): Promise<void> {
        const exchange = await this.getById(id);
        if (!exchange) {
            throw new Error(`Exchange with id: ${id} not found.`);
        }

        for (const item of exchange.exchangeItems) {
            await this.bookService.decreaseBookStock(item.bookId, item.quantity);
        }

        await this.exchangeDAO.delete(id);
    }

    private async validateOrderForExchange(orderId: string): Promise<void> {
        const order = await this.orderService.getById(orderId);
        
        if (!order) {
            throw new Error(`Order with id: ${orderId} not found.`);
        }

        if (order.orderStatus !== OrderStatus.DELIVERED && order.orderStatus !== OrderStatus.IN_EXCHANGE) {
            throw new Error(`Order with id: ${orderId} is not eligible for exchange. Current status: ${order.orderStatus}`);
        }

        // Check if exchange already exists for this order
        const existingExchanges = await this.getByOrderId(orderId);
        if (existingExchanges.length > 0) {
            throw new Error(`Exchange already exists for order: ${orderId}`);
        }
    }

    public async validateExchangeItems(orderId: string, exchangeItems: ItemExchange[]): Promise<void> {
        const order = await this.orderService.getById(orderId);
        if (!order) {
            throw new Error(`Order with id: ${orderId} not found.`);
        }

        for (const exchangeItem of exchangeItems) {
            const orderItem = order.items.find(item => item.bookId === exchangeItem.bookId);
            
            if (!orderItem) {
                throw new Error(`Book with id: ${exchangeItem.bookId} was not part of the original order.`);
            }

            if (exchangeItem.quantity > orderItem.quantity) {
                throw new Error(`Exchange quantity (${exchangeItem.quantity}) exceeds ordered quantity (${orderItem.quantity}) for book: ${exchangeItem.bookId}`);
            }

            // Fix: Compare prices with tolerance for floating point precision
            const expectedPrice = Number(orderItem.unitPrice);
            const receivedPrice = Number(exchangeItem.unitPrice);
            const tolerance = 0.01; // 1 cent tolerance
            
            if (Math.abs(expectedPrice - receivedPrice) > tolerance) {
                throw new Error(`Unit price mismatch for book: ${exchangeItem.bookId}. Expected: ${expectedPrice.toFixed(2)}, Received: ${receivedPrice.toFixed(2)}`);
            }
        }
    }
}