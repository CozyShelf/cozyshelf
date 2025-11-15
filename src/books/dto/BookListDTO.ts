import Book from "../domain/Book";

export default class BookListDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly author: string;
	public readonly coverPath: string;
	public readonly price: number;
	public readonly categories: string[];

	constructor(
		id: string,
		name: string,
		author: string,
		coverPath: string,
		price: number,
		categories: string[]
	) {
		this.id = id;
		this.name = name;
		this.author = author;
		this.coverPath = coverPath;
		this.price = price;
		this.categories = categories;
	}

	public static fromEntity(book: Book): BookListDTO {
		const categories = book.categories.map((cat) =>
			typeof cat === "string" ? cat : String(cat)
		);

		return new BookListDTO(
			book.id,
			book.name,
			book.author,
			book.coverPath,
			typeof book.price === "string" ? parseFloat(book.price) : book.price,
			categories
		);
	}

	public static fromEntityList(books: Book[]): BookListDTO[] {
		return books.map((book) => BookListDTO.fromEntity(book));
	}

	public static fromJSON(json: any): BookListDTO {
		return new BookListDTO(
			json.id,
			json.name,
			json.author,
			json.coverPath,
			typeof json.price === "string" ? parseFloat(json.price) : json.price,
			Array.isArray(json.categories) ? json.categories : []
		);
	}

	public static fromJSONList(jsonArray: any[]): BookListDTO[] {
		return jsonArray.map((json) => BookListDTO.fromJSON(json));
	}

	public get formattedPrice(): string {
		const numericPrice =
			typeof this.price === "string" ? parseFloat(this.price) : this.price;
		return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
	}

	public get primaryCategory(): string {
		return this.categories[0] || "";
	}
}
