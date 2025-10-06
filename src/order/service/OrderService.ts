import OrderDAO from "../dao/typeORM/OrderDAO";
import Order from "../domain/Order";
import OrderModel from "../model/OrderModel";

export class OrderService {
    constructor(
        private readonly orderDAO: OrderDAO
    ) {}

    public async create(order: Order): Promise<Order> {
        const orderModel = OrderModel.fromEntity(order);
        const createdOrderModel = await this.orderDAO.save(orderModel);
        return createdOrderModel.toEntity();
    }

    public async getById(id: string): Promise<Order | null> {
        const orderModel = await this.orderDAO.findById(id);
        if (!orderModel) {
            return null;
        }
        return orderModel.toEntity();
    }

    public async getAll(): Promise<Order[]> {
        const orderModels = await this.orderDAO.findAll();
        if (!orderModels) {
            return [];
        }
        return orderModels.map(orderModel => orderModel.toEntity());
    }
}