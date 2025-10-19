import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import OrderModel from "../../model/OrderModel";

export default class OrderDAO implements IDAO<OrderModel> {
    private repository: Repository<OrderModel>;

    constructor(dataSource: DataSource) {
        this.repository =  dataSource.getRepository(OrderModel);
    }
   
    public async save(order: OrderModel): Promise<OrderModel> {
        return await this.repository.save(order);
    }

    async findAll(): Promise<OrderModel[]> {
        return await this.repository.find({
            relations: [
                'client', 
                'items', 
                'delivery', 
                'payment'
            ]
        });
    }
    
    async findById(id: string): Promise<OrderModel | null> {
        return await this.repository.findOne({ where: { id }, relations: [
            'client', 
            'items', 
            'delivery', 
            'payment'
        ] });
    }
    
    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}