import DomainEntity from "../../generic/domain/DomainEntity";

export default class ItemExchange extends DomainEntity {
    _quantity: number;
    _bookId!: string;
    _unitPrice!: number;
    _subTotal!: number;

    constructor(
        quantity: number,
        bookId: string,
        unitPrice: number
    ) {
        super();
        this._quantity = quantity;
        this._bookId = bookId;
        this._unitPrice = unitPrice;
        this._subTotal = this._quantity * this._unitPrice;
    }

    get bookId(): string {
        return this._bookId;
    }

    set bookId(value: string) {
        this._bookId = value;
    }

    get unitPrice(): number {
        return this._unitPrice;
    }

    set unitPrice(value: number) {
        this._unitPrice = value;
    }

    get subTotal(): number {
        return this._subTotal;
    }

    set subTotal(value: number) {
        this._subTotal = value; 
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    static fromRequestData(data: any): ItemExchange {
        return new ItemExchange(
            data.quantity,
            data.bookId,
            data.unitPrice
        );
    }
}