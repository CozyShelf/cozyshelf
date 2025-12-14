import Book from "../../books/domain/Book";
import Client from "../../client/domain/Client";
import DomainEntity from "../../generic/domain/DomainEntity";
import InvalidQuantityProvided from "./exceptions/InvalidQuantityProvided";

export class CartItem extends DomainEntity {
	_client!: Client;
	_book!: Book;
	_quantity!: number;

	constructor(client: Client, book: Book, quantity: number) {
		super();
		this.client = client;
		this.book = book;
		this.quantity = quantity;
	}

	get client(): Client {
		return this._client;
	}

	set client(value: Client) {
		this._client = value;
	}

	get book(): Book {
		return this._book;
	}

	set book(value: Book) {
		this._book = value;
	}

	get quantity(): number {
		return this._quantity;
	}

	set quantity(value: number) {
		if ((value < 0 || !value) && value != 0) {
			throw new InvalidQuantityProvided(value);
		}
		this._quantity = value;
	}

	updateQuantity(additionalNumber: number) {
		if (additionalNumber < 0) {
			throw new InvalidQuantityProvided(additionalNumber);
		}

		this.quantity += Number(additionalNumber);
	}

	removeQuantity(quantityToRemove: number) {
		if (quantityToRemove < 0) {
			throw new InvalidQuantityProvided(quantityToRemove);
		}

		const newQuantity = this.quantity - Number(quantityToRemove);

		if (newQuantity < 0) {
			throw new InvalidQuantityProvided(newQuantity);
		}

		this.quantity = newQuantity;
	}

	public get subtotal(): number {
		const bookNumericPrice =
			typeof this.book.price === "string"
				? parseFloat(this.book.price)
				: this.book.price;

		return bookNumericPrice * this.quantity;
	}
}
