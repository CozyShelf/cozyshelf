export default class BookSaleDTO {
	bookId: string;
	quantity: number;
	saleDate: Date;
	unitPrice: number;
	totalAmount?: number;

	constructor(
		bookId: string,
		quantity: number,
		saleDate: Date,
		unitPrice: number
	) {
		this.bookId = bookId;
		this.quantity = quantity;
		this.saleDate = saleDate;
		this.unitPrice = unitPrice;
		this.totalAmount = quantity * unitPrice;
	}

	static fromEntity(bookSale: any): BookSaleDTO {
		return new BookSaleDTO(
			bookSale.bookId,
			bookSale.quantity,
			bookSale.saleDate,
			bookSale.unitPrice
		);
	}
}
