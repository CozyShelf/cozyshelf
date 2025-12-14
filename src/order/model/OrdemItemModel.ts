import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import OrderItem from "../domain/OrderItem";
import OrderModel from "./OrderModel";
import BookModel from "../../books/model/BookModel";

@Entity()
export default class OrderItemModel extends GenericModel {
    @Column({ type: "int" })
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "unit_price" })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "sub_total" })
    subTotal!: number;

    @ManyToOne(() => OrderModel, order => order.items)
    @JoinColumn({ name: "order_id" })
    order!: OrderModel;

    @ManyToOne(() => BookModel, { eager: true })
    @JoinColumn({ name: "book_id" })
    book!: BookModel;

    constructor(
        quantity: number,
        book: BookModel,
        unitPrice: number,
        subTotal: number
    ) {
        super();
        this.quantity = quantity;
        this.book = book;
        this.unitPrice = unitPrice;
        this.subTotal = subTotal;
        this.isActive = true;
    }

    public toEntity(): OrderItem {
        const orderItem = new OrderItem(
            this.quantity,
            this.book.id,
            this.unitPrice,
            this.subTotal
        );

        orderItem.id = this.id;
        orderItem.isActive = this.isActive;

        return orderItem;
    }

    public static fromEntity(orderItem: OrderItem): OrderItemModel {
        const model = new OrderItemModel(
            orderItem.quantity,
            { id: orderItem.bookId } as BookModel,
            orderItem.unitPrice,
            orderItem.subTotal
        );

        return model;
    }
}