import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import AddressModel from "../../address/model/AddressModel";
import OrderModel from "./OrderModel";
import Delivery from "../domain/Delivery";

@Entity()
export default class DeliveryModel extends GenericModel {
    @Column({ type: "timestamp", name: "delivery_date" })
    deliveryDate!: Date;
    
    @ManyToOne(() => AddressModel, { eager: true })
    @JoinColumn({ name: "address_id" })
    address!: AddressModel;

    @OneToOne(() => OrderModel, order => order.delivery)
    @JoinColumn({ name: "order_id" })
    order!: OrderModel;

    constructor(
        address: AddressModel,
        deliveryDate: Date
    ) {
        super();
        this.address = address;
        this.deliveryDate = deliveryDate;
    }

    public static fromEntity(delivery: Delivery): DeliveryModel {
        const model = new DeliveryModel(
            delivery._addressId as unknown as AddressModel,
            delivery._deliveryDate
        );

        if (delivery.id) {
            model.id = delivery.id;
        }
        
        return model;
    }

    public toEntity(): Delivery {
        const delivery = new Delivery(this.address as unknown as string);

        delivery.id = this.id;
        delivery.deliveryDate = this.deliveryDate;

        return delivery;
    }
}
  