import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import OrderModel from "../../order/model/OrderModel";
import Freight from "../domain/Freight";

@Entity()
export default class FreightModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    value!: number;

    @OneToOne(() => OrderModel, order => order.payment)
    @JoinColumn({ name: "order_id" })
    order!: OrderModel;

    constructor(value: number) {
        super();
        this.value = value;
    }

    public toEntity(): Freight {
        const freight = new Freight(this.value);
        freight.id = this.id;
        freight.isActive = this.isActive;
        return freight;
    }

    public static fromEntity(freight: Freight): FreightModel {
        const model = new FreightModel(freight.value);

        if (freight.id) model.id = freight.id;
        
        model.isActive = freight.isActive;
        
        return model;
    }
}
