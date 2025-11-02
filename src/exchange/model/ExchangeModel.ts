import { Entity, Column, OneToMany, JoinColumn } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import ItemExchangeModel from "./ItemExchangeModel";
import Exchange from "../domain/Exchange";

@Entity('exchanges')
export default class ExchangeModel extends GenericModel {
    @Column({ name: 'order_id', type: 'varchar', length: 255 })
    orderId!: string;

    @Column({ name: 'item_sub_total', type: 'decimal', precision: 10, scale: 2, default: 0 })
    exchangeItemsTotal!: number;

    @OneToMany(() => ItemExchangeModel, itemExchange => itemExchange.exchange, { 
        cascade: true,
        eager: true 
    })
    @JoinColumn()
    exchangeItems!: ItemExchangeModel[];

    public static fromEntity(exchange: Exchange): ExchangeModel {
        const exchangeModel = new ExchangeModel();
        exchangeModel.id = exchange.id;
        exchangeModel.orderId = exchange.orderId;
        exchangeModel.exchangeItemsTotal = exchange.exchangeItemsTotal;
        exchangeModel.createdAt = exchange.createdAt;
        
        // Convert exchange items to models
        if (exchange.exchangeItems) {
            exchangeModel.exchangeItems = exchange.exchangeItems.map(item => 
                ItemExchangeModel.fromEntity(item)
            );
        }

        return exchangeModel;
    }

    public toEntity(): Exchange {
        const exchangeItemsEntities = this.exchangeItems ? 
            this.exchangeItems.map(itemModel => itemModel.toEntity()) : [];
        
        const exchange = new Exchange(this.orderId, exchangeItemsEntities);
        exchange.id = this.id;
        exchange.exchangeItemsTotal = Number(this.exchangeItemsTotal);
        exchange.createdAt = this.createdAt;

        return exchange;
    }
}