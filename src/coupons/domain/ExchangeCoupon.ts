import { CouponEntity } from "./CouponEntity";
import { CouponType } from "./enums/CouponType";

export class ExchangeCoupon extends CouponEntity {
    constructor(
        value: number, 
        clientId: string, 
        type: CouponType, 
        description?: string
    ) {
        super(value, clientId, type, description);
    }

    public static fromRequestData(data: any, clientId: string): ExchangeCoupon {
        return new ExchangeCoupon(
            data.value,
            clientId,
            data.type,
            data.description
        );
    }
}