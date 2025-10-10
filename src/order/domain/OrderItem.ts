import DomainEntity from "../../generic/domain/DomainEntity";

export default class OrderItem extends DomainEntity{
    _quantity: number;
    _bookId!: string;
    _unitPrice!: number;
    _subTotal!: number;

    constructor(
        quantity: number, 
        bookId: string, 
        unitPrice: number, 
        subTotal: number
    ) {
        super();
        this._quantity = quantity;
        this._bookId = bookId;
        this._unitPrice = unitPrice;
        this._subTotal = subTotal;
    }

    get quantity(): number {
        return this._quantity;
    }
    
    get bookId(): string {
        return this._bookId;
    }

    get unitPrice(): number {
        return this._unitPrice;
    }

    get subTotal(): number {
        return this._subTotal;
    }

    static fromRequestData(data: any): OrderItem {
        return new OrderItem(
            data.quantity,
            data.bookId,
            data.unitPrice,
            data.subTotal
        );
    }
}