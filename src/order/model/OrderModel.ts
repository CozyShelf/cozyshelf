import { Entity, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import Order from "../domain/Order";
import OrderStatus from "../domain/enums/OrderStatus";
import ClientModel from "../../client/model/ClientModel";
import OrderItemModel from "./OrdemItemModel";
import PaymentModel from "./PaymentModel";
import DeliveryModel from "./DeliveryModel";

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

    @OneToOne(() => DeliveryModel, delivery => delivery.order, { cascade: true, eager: true })
    delivery!: DeliveryModel;

    @OneToOne(() => PaymentModel, payment => payment.order, { cascade: true })
    payment!: PaymentModel;

    @Column({ type: "varchar", nullable: true, name: "promotional_coupon_id" })
    promotionalCouponId?: string;

    @Column({ type: "json", nullable: true, name: "exchange_coupon_ids" })
    exchangeCouponIds?: string[];

    constructor(        
        client: ClientModel,
        items: OrderItemModel[],
        itemSubTotal: number,
        freight: number,
        discount: number,
        finalTotal: number,
        delivery: DeliveryModel,
        payment: PaymentModel
    ) {
        super();
        this.client = client;
        this.items = items;
        this.orderStatus = OrderStatus.PROCESSING;
        this.itemSubTotal = itemSubTotal;
        this.freight = freight;
        this.discount = discount;
        this.finalTotal = finalTotal;
        this.delivery = delivery;
        this.payment = payment;
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
            this.delivery.toEntity(),
            this.payment.toEntity(),
            this.promotionalCouponId,
            this.exchangeCouponIds || [] 
        );

        order.id = this.id;
        order.isActive = this.isActive;
        order.orderStatus = this.orderStatus;

        return order;
    }

    public static fromEntity(order: Order): OrderModel {
        const deliveryModel = DeliveryModel.fromEntity(order.delivery);
        
        const model = new OrderModel(
            { id: order.clientId } as ClientModel,
            [],
            order.itemSubTotal,
            order.freight,
            order.discount,
            order.finalTotal,
            deliveryModel,
            new PaymentModel(0, [])
        );

        if (order.id) {
            model.id = order.id;
        }

        model.promotionalCouponId = order.promotionalCouponId;
        model.exchangeCouponIds = order.exchangeCouponsIds;

        model.items = order.items.map(item => {
            const itemModel = OrderItemModel.fromEntity(item);
            itemModel.order = model; 
            return itemModel;
        });

        if (order.payment) {
            const paymentModel = PaymentModel.fromEntity(order.payment);
            paymentModel.order = model;
            
            paymentModel.paymentCards = paymentModel.paymentCards?.map(cardModel => {
                cardModel.payment = paymentModel;
                return cardModel;
            }) || [];
            
            model.payment = paymentModel;
        }

        deliveryModel.order = model;
        model.orderStatus = order.orderStatus as OrderStatus;
        
        return model;
    }

    public updateFromEntity(order: Order): void {
        this.orderStatus = order.orderStatus;
    }
}