import Book from "../domain/Book";

export default class BookAdminDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly author: string;
	public readonly coverPath: string;
	public readonly price: number;
	public readonly isbn: string;
	public readonly categories: string[];
	public readonly publisher: string;
	public readonly barCode: string;
	public readonly stockQuantity: number;

	constructor(
		id: string,
		name: string,
		author: string,
		coverPath: string,
		price: number,
		isbn: string,
		categories: string[],
		publisher: string,
		barCode: string,
		stockQuantity: number
	) {
		this.id = id;
		this.name = name;
		this.author = author;
		this.coverPath = coverPath;
		this.price = price;
		this.isbn = isbn;
		this.categories = categories;
		this.publisher = publisher;
		this.barCode = barCode;
		this.stockQuantity = stockQuantity;
	}

	public static fromEntity(book: Book): BookAdminDTO {
		const categories = book.categories.map((cat) =>
			typeof cat === "string" ? cat : String(cat)
		);

		return new BookAdminDTO(
			book.id,
			book.name,
			book.author,
			book.coverPath,
			typeof book.price === "string" ? parseFloat(book.price) : book.price,
			book.isbn,
			categories,
			book.publisher,
			book.barCode,
			book.stockQuantity
		);
	}

	public static fromEntityList(books: Book[]): BookAdminDTO[] {
		return books.map((book) => BookAdminDTO.fromEntity(book));
	}

	public get formattedPrice(): string {
		const numericPrice =
			typeof this.price === "string" ? parseFloat(this.price) : this.price;
		return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
	}

	public get categoriesAsString(): string {
		return this.categories.join(", ");
	}
}
