import DomainEntity from "../../generic/domain/DomainEntity";
import ItemExchange from "./ItemExchange";

export default class Exchange extends DomainEntity {
    _orderId!: string;
    _exchangeItemsTotal: number = 0;
    _exchangeItems!: ItemExchange[];
    _createdAt!: Date;

    constructor(
        orderId: string,
        exchangeItems: ItemExchange[]
    ) {
        super();
        this._orderId = orderId;
        this._exchangeItems = exchangeItems;
        this._createdAt = new Date();
        this._exchangeItemsTotal =  this.calculateExchangeItemsTotal();
    }

    get orderId(): string {
        return this._orderId;
    }

    set orderId(value: string) {
        this._orderId = value;
    }

    get exchangeItems(): ItemExchange[] {
        return this._exchangeItems;
    }

    set exchangeItems(value: ItemExchange[]) {
        this._exchangeItems = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

    get exchangeItemsTotal(): number {
        return this._exchangeItemsTotal;
    }

    set exchangeItemsTotal(value: number) {
        this._exchangeItemsTotal = value;
    }

    private calculateExchangeItemsTotal(): number {
        if (!this._exchangeItems || !Array.isArray(this._exchangeItems)) {
            console.log("No exchange items found. Total is 0.");
            return 0;
        }
        return this._exchangeItems.reduce((total, item) => total + item.subTotal, 0);
    }

    static fromRequestData(data: any): Exchange {
        const exchangeItems = data.exchangeItems.map((item: any) => ItemExchange.fromRequestData(item));
        return new Exchange(
            data.orderId,
            exchangeItems
        );
    }
}
