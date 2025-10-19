import { ChildEntity } from "typeorm";
import { CouponType } from "../domain/enums/CouponType";
import { CouponModel } from "./CouponModel";
import { ExchangeCoupon } from "../domain/ExchangeCoupon";
import ClientModel from "../../client/model/ClientModel";

@ChildEntity(CouponType.EXCHANGE)
export class ExchangeCouponModel extends CouponModel {
    public constructor(
        value: number, 
        clientId: string, 
        type: CouponType, 
        description?: string,
    ) {
        super();
        this.value = value;
        this.type = type;
        this.description = description;
        this.client = { id: clientId } as ClientModel;
    }

    public toEntity(): ExchangeCoupon {
        const coupon = new ExchangeCoupon(
            this.value,
            this.client.id,
            this.type,
            this.description
        );

        coupon.id = this.id;
        coupon.orderId = this.orderId;

        return coupon;
    }

    public static fromEntity(coupon: ExchangeCoupon): ExchangeCouponModel {
        const model = new ExchangeCouponModel(
            coupon.value,
            coupon.clientId,
            CouponType.EXCHANGE,
            coupon.description
        );

        if (coupon.id){
            model.id = coupon.id;
        }

        model.orderId = coupon.orderId;

        return model;
    }
}