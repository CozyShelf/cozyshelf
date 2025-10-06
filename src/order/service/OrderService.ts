import OrderDAO from "../dao/typeORM/OrderDAO";
import Order from "../domain/Order";
import OrderModel from "../model/OrderModel";

export class OrderService {
    constructor(
        private readonly orderDAO: OrderDAO
    ) {}

    public async create(order: Order): Promise<Order> {
        console.log("order: ", order);
        console.log("in service");      

        const orderModel = OrderModel.fromEntity(order);

        const createdOrderModel = await this.orderDAO.save(orderModel);
        console.log("createdOrderModel: ", createdOrderModel);
        const created = createdOrderModel.toEntity();
        console.log("created: ", created);
        return created;
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
        console.log("orderModels: ", orderModels);
        if (!orderModels) {
            return [];
        }
        const entities = orderModels.map(orderModel => orderModel.toEntity());
        console.log("entities: ", entities);
        return entities;
    }
}