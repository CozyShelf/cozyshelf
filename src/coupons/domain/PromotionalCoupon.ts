import { CouponEntity } from "./CouponEntity";
import { CouponType } from "./enums/CouponType";

export class PromotionalCoupon extends CouponEntity {
    _expirationDate: Date;

    constructor(
        value: number, 
        clientId: string, 
        type: CouponType, 
        expirationDate: Date,
        description?: string,
    ) {
        super(value, clientId, type, description);
        this._expirationDate = expirationDate;
    }

    isValid(): boolean {
        if (this._expirationDate && this._expirationDate < new Date()) {
            return false;
        }
        return true;
    }

    get expirationDate(): Date {
        return this._expirationDate;
    }

    set expirationDate(value: Date) {
        this._expirationDate = value;
    }
}