import Client from "../../client/domain/Client";
import DomainEntity from "../../generic/domain/DomainEntity";

export class PromotionalCoupon extends DomainEntity {
    _valor: number;
    _expirationDate: Date;
    _codigo: string;
    _client: Client;

    constructor(valor: number, expirationDate: Date, codigo: string, client: Client) {
        super();
        this._valor = valor;
        this._expirationDate = expirationDate;
        this._codigo = codigo;
        this._client = client;
    }

    isValid(): boolean {
        const now = new Date();
        return this._expirationDate >= now;
    }

    static fromRequestData(data: any): PromotionalCoupon {
        return new PromotionalCoupon(
            data.valor,
            new Date(data.expirationDate),
            data.codigo,
            Client.fromRequestData(data.client)
        );
    }

    get valor(): number {
        return this._valor;
    }

    get expirationDate(): Date {
        return this._expirationDate;
    }

    get codigo(): string {
        return this._codigo;
    }

    get client(): Client {
        return this._client;
    }
    
    set valor(value: number) {
        this._valor = value;
    }

    set expirationDate(value: Date) {
        this._expirationDate = value;
    }

    set codigo(value: string) {
        this._codigo = value;
    }

    set client(value: Client) {
        this._client = value;
    }
}