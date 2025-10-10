import DomainEntity from "../../generic/domain/DomainEntity";

export default class Delivery extends DomainEntity{
    _addressId!: string;
    _deliveryDate!: Date;

    constructor(
        addressId: string,
    ) {
        super();
        this._addressId = addressId;
        this._deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default delivery date is 7 days from now
    }

    get addressId(): string {
        return this._addressId;
    }
    
    get deliveryDate(): Date {
        return this._deliveryDate;
    }

    set deliveryDate(value: Date) {
        this._deliveryDate = value;
    }

    static fromRequestData(data: any): Delivery {
        const delivery = new Delivery(
            data.addressId
        );

        return delivery;
    }
}