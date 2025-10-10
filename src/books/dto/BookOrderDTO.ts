import Book from "../domain/Book";

export default class BookOrderDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly coverPath: string;
	public readonly price: number;

	constructor(id: string, name: string, coverPath: string, price: number) {
		this.id = id;
		this.name = name;
		this.coverPath = coverPath;
		this.price = price;
	}

	public static fromEntity(book: Book): BookOrderDTO {
		return new BookOrderDTO(
			book.id,
			book.name,
			book.coverPath,
			typeof book.price === "string" ? parseFloat(book.price) : book.price
		);
	}

	public static fromEntityList(books: Book[]): BookOrderDTO[] {
		return books.map((book) => BookOrderDTO.fromEntity(book));
	}

	public get formattedPrice(): string {
		const numericPrice =
			typeof this.price === "string" ? parseFloat(this.price) : this.price;
		return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
	}
}
