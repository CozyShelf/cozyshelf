import DomainEntity from "../../generic/domain/DomainEntity";

export default class Freight extends DomainEntity {
    private _value!: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    public static fromRequestData(freightValue: any): Freight {
        return new Freight(freightValue);
    }
}