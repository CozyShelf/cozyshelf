import DomainEntity from "../../generic/domain/DomainEntity";

export default class BookSale extends DomainEntity {
	_bookId: string;
	_quantity: number;
	_saleDate: Date;
	_unitPrice: number;

	constructor(
		bookId: string,
		quantity: number,
		saleDate: Date = new Date(),
		unitPrice: number = 0
	) {
		super();
		this._bookId = bookId;
		this._quantity = quantity;
		this._saleDate = saleDate;
		this._unitPrice = unitPrice;
	}

	static fromJSON(data: any): BookSale {
		const bookSale = new BookSale(
			data.bookId,
			data.quantity,
			data.saleDate ? new Date(data.saleDate) : new Date(),
			data.unitPrice || 0
		);

		if (data.id) {
			bookSale.id = data.id;
		}

		if (data.isActive !== undefined) {
			bookSale.isActive = data.isActive;
		}

		return bookSale;
	}

	get bookId(): string {
		return this._bookId;
	}

	set bookId(value: string) {
		this._bookId = value;
	}

	get quantity(): number {
		return this._quantity;
	}

	set quantity(value: number) {
		if (value <= 0) {
			throw new Error("Quantidade deve ser maior que zero");
		}
		this._quantity = value;
	}

	get saleDate(): Date {
		return this._saleDate;
	}

	set saleDate(value: Date) {
		this._saleDate = value;
	}

	get unitPrice(): number {
		return this._unitPrice;
	}

	set unitPrice(value: number) {
		if (value < 0) {
			throw new Error("Preço unitário não pode ser negativo");
		}
		this._unitPrice = value;
	}

	getTotalAmount(): number {
		return this._quantity * this._unitPrice;
	}

	isSaleOnDate(date: Date): boolean {
		return (
			this._saleDate.getFullYear() === date.getFullYear() &&
			this._saleDate.getMonth() === date.getMonth() &&
			this._saleDate.getDate() === date.getDate()
		);
	}

	isSaleBetweenDates(startDate: Date, endDate: Date): boolean {
		return this._saleDate >= startDate && this._saleDate <= endDate;
	}
}
