import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import ExchangeModel from "../../model/ExchangeModel";

export default class ExchangeDAO implements IDAO<ExchangeModel> {
    private repository: Repository<ExchangeModel>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(ExchangeModel);
    }

    public async save(exchange: ExchangeModel): Promise<ExchangeModel> {
        const savedExchange = await this.repository.save(exchange);
        const completeExchange = await this.findById(savedExchange.id);
        return completeExchange!;
    }

    async findAll(): Promise<ExchangeModel[]> {
        return await this.repository.find({
            relations: [
                "exchangeItems",
                "order"
            ],
            order: {
                createdAt: "DESC"
            }
        });
    }

    async findById(id: string): Promise<ExchangeModel | null> {
        return await this.repository.findOne({
            where: { id },
            relations: [
                "exchangeItems"
            ]
        });
    }

    async findByOrderId(orderId: string): Promise<ExchangeModel[]> {
        return await this.repository.find({
            where: { orderId },
            relations: [
                "exchangeItems"
            ],
            order: {
                createdAt: "DESC"
            }
        });
    }

    async findAllByUserId(userId: string): Promise<ExchangeModel[]> {
        return await this.repository
            .createQueryBuilder("exchange")
            .innerJoinAndSelect("exchange.exchangeItems", "itemExchange")
            .innerJoin("orders", "order", "exchange.orderId = order.id")
            .where("order.clientId = :userId", { userId })
            .orderBy("exchange.createdAt", "DESC")
            .getMany();
    }
    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}