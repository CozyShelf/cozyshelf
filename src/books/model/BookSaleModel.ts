import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "./BookModel";
import BookSale from "../domain/BookSale";

@Entity("book_sale")
export default class BookSaleModel extends GenericModel {
	@ManyToOne(() => BookModel, { eager: true })
	@JoinColumn({ name: "book_id" })
	book!: BookModel;

	@Column({ type: "int" })
	quantity!: number;

	@Column({ type: "timestamp" })
	saleDate!: Date;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	unitPrice!: number;

	constructor(
		book: BookModel,
		quantity: number,
		saleDate: Date = new Date(),
		unitPrice: number = 0
	) {
		super();
		this.book = book;
		this.quantity = quantity;
		this.saleDate = saleDate;
		this.unitPrice = unitPrice;
	}

	toEntity(): BookSale {
		const bookSale = new BookSale(
			this.book.id,
			this.quantity,
			this.saleDate,
			this.unitPrice
		);

		bookSale.id = this.id;
		bookSale.isActive = this.isActive;

		return bookSale;
	}

	static fromEntity(bookSale: BookSale, book: BookModel): BookSaleModel {
		const model = new BookSaleModel(
			book,
			bookSale.quantity,
			bookSale.saleDate,
			bookSale.unitPrice
		);

		if (bookSale.id) {
			model.id = bookSale.id;
		}

		model.isActive = bookSale.isActive;

		return model;
	}
}
