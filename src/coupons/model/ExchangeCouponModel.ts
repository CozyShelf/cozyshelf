import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import { ExchangeCoupon } from "../domain/ExchangeCoupon";
import ClientModel from "../../client/model/ClientModel";
import OrderModel from "../../order/model/OrderModel";

@Entity()
export default class ExchangeCouponModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    value!: number;

    @Column({ type: "varchar", length: 50, unique: true })
    code!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string;

    @ManyToOne(() => ClientModel)
    @JoinColumn({ name: "client_id" })
    client!: ClientModel;

    @ManyToOne(() => OrderModel, order => order.exchangeCoupons)
    @JoinColumn({ name: "order_id" })
    order!: OrderModel;

    public toEntity(): ExchangeCoupon {
        return new ExchangeCoupon(
            this.value,
            this.code,
            this.client.id as unknown as string,
            this.description
        );
    }

    public static fromEntity(ExchangeCoupon: ExchangeCoupon): ExchangeCouponModel {
        const model = new ExchangeCouponModel();
        model.value = ExchangeCoupon.value;
        model.code = ExchangeCoupon.code;
        model.description = ExchangeCoupon.description;
        model.client = ExchangeCoupon.clientId as unknown as ClientModel;
        return model;
    }

    public updateFromEntity(ExchangeCoupon: ExchangeCoupon): void {
        this.isActive = ExchangeCoupon.isActive;
    }
}