import DomainEntity from "../../generic/domain/DomainEntity";

export class ExchangeCoupon extends DomainEntity {
    _value: number;
    _code: string;
    _description?: string;
    _clientId: string;

    constructor(value: number, code: string,  clientId: string, description?: string) {
        super();
        this._value = value;
        this._code = code;
        this._clientId = clientId;
        this._description = description;
    }

    isValid(): boolean {
        return true;
    }

    static fromRequestData(data: any, clientId: string): ExchangeCoupon {
        return new ExchangeCoupon(
            data.valor,
            data.codigo,
            clientId
        );
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
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
}