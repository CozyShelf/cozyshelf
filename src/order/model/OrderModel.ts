
import { Entity, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import Order from "../domain/Order";
import OrderStatus from "../domain/enums/OrderStatus";
import ClientModel from "../../client/model/ClientModel";
import OrderItemModel from "./OrdemItemModel";
import AddressModel from "../../address/model/AddressModel";
import PaymentModel from "./PaymentModel";

@Entity()
export default class OrderModel extends GenericModel {
    @ManyToOne(() => ClientModel)
    @JoinColumn({ name: "client_id" })
    client!: ClientModel;

    @OneToMany(() => OrderItemModel, orderItem => orderItem.order, { cascade: true })
    items!: OrderItemModel[];

    @Column({
        type: "enum",
        enum: OrderStatus
    })
    orderStatus!: OrderStatus;


    @Column({ type: "decimal", precision: 10, scale: 2, name: "item_sub_total" })
    itemSubTotal!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    freight!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    discount!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "final_total" })
    finalTotal!: number;

    // delivery
    @Column({ type: "timestamp", name: "delivery_date" })
    deliveryDate!: Date;
    
    @ManyToOne(() => AddressModel, { eager: true })
    @JoinColumn({ name: "address_id" })
    address!: AddressModel;

    @OneToOne(() => PaymentModel, payment => payment.order, { cascade: true })
    payment!: PaymentModel;

    @Column({ type: "varchar", length: 50, nullable: true, name: "promotional_coupon_code" })
    promotionalCouponCode?: string;

    @Column({ type: "json", nullable: true })
    exchangeCoupons?: string[];

    constructor(        
        client: ClientModel,
        items: OrderItemModel[],
        itemSubTotal: number,
        freight: number,
        discount: number,
        finalTotal: number,
        address: AddressModel,
        deliveryDate: Date,
        payment: PaymentModel,
        promotionalCoupon?: string,
        exchangeCoupons?: string[]
    ) {
        super();
        this.client = client;
        this.items = items;
        this.orderStatus = OrderStatus.PROCESSING;
        this.itemSubTotal = itemSubTotal;
        this.freight = freight;
        this.discount = discount;
        this.finalTotal = finalTotal;

        this.address = address;
        this.deliveryDate = deliveryDate; // Default delivery date is 7 days from now
        
        this.payment = payment;

        this.promotionalCouponCode = promotionalCoupon;
        this.exchangeCoupons = exchangeCoupons;

        this.isActive = true;
    }

    public toEntity(): Order {
        const order = new Order(
            this.items.map(item => item.toEntity()),
            this.itemSubTotal,
            this.freight,
            this.discount,
            this.finalTotal,
            this.client.id,
            this.address.id,
            this.payment.toEntity(),
            this.promotionalCouponCode,
            this.exchangeCoupons
        );

        order.id = this.id;
        order.isActive = this.isActive;
        order.deliveryDate = this.deliveryDate;
        order.orderStatus = this.orderStatus;

        return order;
    }

    // ...existing code...
    // ...existing code...
    public static fromEntity(order: Order): OrderModel {
        const model = new OrderModel(
            { id: order.clientId } as ClientModel,
            [], // Criar items vazio primeiro
            order.itemSubTotal,
            order.freight,
            order.discount,
            order.finalTotal,
            { id: order.addressId } as AddressModel,
            order.deliveryDate,
            new PaymentModel(0, []),
            order.promotionalCouponCode,
            order.exchangeCoupons
        );

        // Definir relacionamentos após criação
        model.items = order.items.map(item => {
            const itemModel = OrderItemModel.fromEntity(item);
            itemModel.order = model; // Definir relacionamento
            return itemModel;
        });

        if (order.payment) {
            const paymentModel = PaymentModel.fromEntity(order.payment);
            paymentModel.order = model; // Definir relacionamento
            
            // Definir relacionamento dos paymentCards
            paymentModel.paymentCards = paymentModel.paymentCards?.map(cardModel => {
                cardModel.payment = paymentModel;
                return cardModel;
            }) || [];
            
            model.payment = paymentModel;
        }

        model.orderStatus = order.orderStatus as OrderStatus;

        return model;
    }
    // ...existing code...

    public updateFromEntity(order: Order): void {
        this.orderStatus = order.orderStatus;
    }
}