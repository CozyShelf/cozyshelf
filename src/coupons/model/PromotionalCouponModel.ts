import { ChildEntity, Column, JoinColumn, OneToOne } from "typeorm";
import { CouponType } from "../domain/enums/CouponType";
import { CouponModel } from "./CouponModel";
import { PromotionalCoupon } from "../domain/PromotionalCoupon";
import ClientModel from "../../client/model/ClientModel";
import OrderModel from "../../order/model/OrderModel";

@ChildEntity(CouponType.PROMOTIONAL)
export class PromotionalCouponModel extends CouponModel {
    @Column({ type: "timestamp", nullable: true, name: "expiration_date" })
    expirationDate!: Date;

    @OneToOne(() => OrderModel, order => order.promotionalCouponCode)
    @JoinColumn({ name: "order_id" })
    order?: OrderModel;

    public constructor(
        value: number,  
        clientId: string, 
        type: CouponType, 
        expirationDate: Date,
        description?: string,
    ) {
        super();
        this.value = value;
        this.type = type;
        this.expirationDate = expirationDate;
        this.description = description;
        this.client = { id: clientId } as ClientModel;
    }

    public toEntity(): PromotionalCoupon {
        const coupon = new PromotionalCoupon(
            this.value,
            this.client.id,
            this.type,
            this.expirationDate,
            this.description
        );

        coupon.id = this.id;

        if (this.order) {
            coupon.orderId = this.order.id as unknown as string;
        }

        return coupon;
    }

    public static fromEntity(coupon: PromotionalCoupon): PromotionalCouponModel {
        const model = new PromotionalCouponModel(
            coupon.value,
            coupon.clientId,
            CouponType.PROMOTIONAL,
            coupon.expirationDate,
            coupon.description
        );

        if (coupon.id){
            model.id = coupon.id;
        }

        if (coupon.orderId) {
            model.order = { id: coupon.orderId } as OrderModel;
        }
        
        return model;
    }
}