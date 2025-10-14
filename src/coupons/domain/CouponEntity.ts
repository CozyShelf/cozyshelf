import DomainEntity from "../../generic/domain/DomainEntity";
import { CouponType } from "./enums/CouponType";

export class CouponEntity extends DomainEntity {
    _value: number;
    _clientId: string;
    _type!: CouponType;
    _description?: string;
    _orderId?: string;

    constructor(
        value: number, 
        clientId: string, 
        type: CouponType, 
        description?: string,
    ) {
        super();
        this._value = value;
        this._clientId = clientId;
        this._type = type;
        this._description = description;
    }

    isValid(): boolean {
        return true;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get clientId(): string {
        return this._clientId;
    }

    set clientId(value: string) {
        this._clientId = value;
    }

    get description(): string | undefined {
        return this._description;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    get type(): CouponType {
        return this._type;
    }
    
    set type(value: CouponType) {
        this._type = value;
    }

    get orderId(): string | undefined {
        return this._orderId;
    }

    set orderId(value: string | undefined) {
        this._orderId = value;
    }
}