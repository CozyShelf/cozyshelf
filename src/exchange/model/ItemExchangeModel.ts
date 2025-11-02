import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ExchangeModel from "./ExchangeModel";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "../../books/model/BookModel";
import ItemExchange from "../domain/ItemExchange";

@Entity()
export default class ItemExchangeModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 0, name: "quantity" })
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "unit_price" })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "sub_total" })
    subTotal!: number;
    
    @ManyToOne(() => ExchangeModel, exchange => exchange.exchangeItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exchange_id' })
    exchange!: ExchangeModel;

    @ManyToOne(() => BookModel, { eager: true })
    @JoinColumn({ name: "book_id" })
    book!: BookModel;

    constructor(
        quantity: number,
        book: BookModel,
        unitPrice: number,
        subTotal: number,
    ) {
        super();
        this.quantity = quantity;
        this.book = book;
        this.unitPrice = unitPrice;
        this.subTotal = subTotal;
        this.isActive = true;
    }

    public toEntity(): ItemExchange {
        const itemExchange = new ItemExchange(
            this.quantity,
            this.book.id,
            this.unitPrice
        );

        itemExchange.id = this.id;
        itemExchange.isActive = this.isActive;

        return itemExchange;
    }

    public static fromEntity(itemExchange: ItemExchange): ItemExchangeModel {
        const model = new ItemExchangeModel(
            itemExchange.quantity,
            { id: itemExchange.bookId } as BookModel,
            itemExchange.unitPrice,
            itemExchange.subTotal
        );

        model.id = itemExchange.id;
        model.isActive = itemExchange.isActive;

        return model;
    }

}
