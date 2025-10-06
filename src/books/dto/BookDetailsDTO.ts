import Book from "../domain/Book";

export default class BookDetailsDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly author: string;
	public readonly coverPath: string;
	public readonly price: number;
	public readonly resume: string;
	public readonly isbn: string;
	public readonly numberOfPages: number;
	public readonly categories: string[];
	public readonly year: number;
	public readonly edition: string;
	public readonly publisher: string;
	public readonly height: number;
	public readonly width: number;
	public readonly weight: number;
	public readonly thickness: number;
	public readonly barCode: string;

	constructor(
		id: string,
		name: string,
		author: string,
		coverPath: string,
		price: number,
		resume: string,
		isbn: string,
		numberOfPages: number,
		categories: string[],
		year: number,
		edition: string,
		publisher: string,
		height: number,
		width: number,
		weight: number,
		thickness: number,
		barCode: string
	) {
		this.id = id;
		this.name = name;
		this.author = author;
		this.coverPath = coverPath;
		this.price = price;
		this.resume = resume;
		this.isbn = isbn;
		this.numberOfPages = numberOfPages;
		this.categories = categories;
		this.year = year;
		this.edition = edition;
		this.publisher = publisher;
		this.height = height;
		this.width = width;
		this.weight = weight;
		this.thickness = thickness;
		this.barCode = barCode;
	}

	public static fromEntity(book: Book): BookDetailsDTO {
		const categories = book.categories.map((cat) =>
			typeof cat === "string" ? cat : String(cat)
		);

		return new BookDetailsDTO(
			book.id,
			book.name,
			book.author,
			book.coverPath,
			typeof book.price === "string" ? parseFloat(book.price) : book.price,
			book.resume,
			book.isbn,
			book.numberOfPages,
			categories,
			typeof book.year === "string" ? parseInt(book.year) : book.year,
			book.edition,
			book.publisher,
			typeof book.height === "string" ? parseFloat(book.height) : book.height,
			typeof book.width === "string" ? parseFloat(book.width) : book.width,
			typeof book.weight === "string" ? parseFloat(book.weight) : book.weight,
			typeof book.thickness === "string"
				? parseFloat(book.thickness)
				: book.thickness,
			book.barCode
		);
	}

	public get formattedPrice(): string {
		const numericPrice =
			typeof this.price === "string" ? parseFloat(this.price) : this.price;
		return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
	}

	public get formattedDimensions(): string {
		const height =
			typeof this.height === "string" ? parseFloat(this.height) : this.height;
		const width =
			typeof this.width === "string" ? parseFloat(this.width) : this.width;
		const thickness =
			typeof this.thickness === "string"
				? parseFloat(this.thickness)
				: this.thickness;
		return `${height}cm x ${width}cm x ${thickness}cm`;
	}

	public get formattedWeight(): string {
		const weight =
			typeof this.weight === "string" ? parseFloat(this.weight) : this.weight;
		return `${weight}kg`;
	}
}
