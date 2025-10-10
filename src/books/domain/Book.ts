import DomainEntity from "../../generic/domain/DomainEntity";
import BookCategory from "./enums/BookCategory";

export default class Book extends DomainEntity {
	_name: string;
	_author: string;
	_coverPath: string;
	_price: number;
	_resume: string;
	_isbn: string;
	_numberOfPages: number;
	_categories: BookCategory[];
	_year: number;
	_edition: string;
	_publisher: string;
	_height: number;
	_width: number;
	_weight: number;
	_thickness: number;
	_barCode: string;
	_inactivationCause: string;
	_activationCause: string;
	_stockQuantity: number;

	constructor(
		name: string,
		author: string,
		coverPath: string,
		price: number,
		resume: string = "",
		isbn: string = "",
		numberOfPages: number = 0,
		categories: BookCategory[] | string[] = [],
		year: number = 0,
		edition: string = "",
		publisher: string,
		height: number = 0,
		width: number = 0,
		weight: number = 0,
		thickness: number = 0,
		barCode: string = "",
		inactivationCause: string = "",
		activationCause: string = "",
		stockQuantity: number = 0
	) {
		super();
		this._name = name;
		this._author = author;
		this._coverPath = coverPath;
		this._price = price;
		this._resume = resume;
		this._isbn = isbn;
		this._numberOfPages = numberOfPages;
		this._categories = this.parseCategories(categories);
		this._year = year;
		this._edition = edition;
		this._publisher = publisher;
		this._height = height;
		this._width = width;
		this._weight = weight;
		this._thickness = thickness;
		this._barCode = barCode;
		this._inactivationCause = inactivationCause;
		this._activationCause = activationCause;
		this._stockQuantity = stockQuantity;
	}

	private parseCategories(categories: BookCategory[] | string[]) {
		if (!categories || categories.length === 0) return [];

		return categories.map((cat) => {
			if (typeof cat === "string") {
				const enumValue = Object.values(BookCategory).find(
					(value) => value === cat
				);
				if (enumValue) {
					return enumValue as BookCategory;
				}
				console.warn(`Categoria desconhecida: ${cat}`);
				return BookCategory.LITERATURA_CLASSICA;
			}
			return cat;
		});
	}

	static fromJSON(data: any): Book {
		return new Book(
			data.name,
			data.author,
			data.coverPath,
			data.price,
			data.resume,
			data.isbn,
			data.numberOfPages,
			data.categories,
			data.year,
			data.edition,
			data.publisher,
			data.height,
			data.width,
			data.weight,
			data.thickness,
			data.barCode,
			data.inactivationCause,
			data.activationCause,
			data.stockQuantity || 0
		);
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get author(): string {
		return this._author;
	}

	set author(value: string) {
		this._author = value;
	}

	get coverPath(): string {
		return this._coverPath;
	}

	set coverPath(value: string) {
		this._coverPath = value;
	}

	get price(): number {
		return this._price;
	}

	set price(value: number) {
		this._price = value;
	}

	get resume(): string {
		return this._resume;
	}

	set resume(value: string) {
		this._resume = value;
	}

	get isbn(): string {
		return this._isbn;
	}

	set isbn(value: string) {
		this._isbn = value;
	}

	get numberOfPages(): number {
		return this._numberOfPages;
	}

	set numberOfPages(value: number) {
		this._numberOfPages = value;
	}

	get categories(): BookCategory[] | string[] {
		return this._categories;
	}

	set categories(value: BookCategory[] | string[]) {
		this.parseCategories(value);
	}

	get year(): number {
		return this._year;
	}

	set year(value: number) {
		this._year = value;
	}

	get edition(): string {
		return this._edition;
	}

	set edition(value: string) {
		this._edition = value;
	}

	get publisher(): string {
		return this._publisher;
	}

	set publisher(value: string) {
		this._publisher = value;
	}

	get height(): number {
		return this._height;
	}

	set height(value: number) {
		this._height = value;
	}

	get width(): number {
		return this._width;
	}

	set width(value: number) {
		this._width = value;
	}

	get weight(): number {
		return this._weight;
	}

	set weight(value: number) {
		this._weight = value;
	}

	get thickness(): number {
		return this._thickness;
	}

	set thickness(value: number) {
		this._thickness = value;
	}

	get barCode(): string {
		return this._barCode;
	}

	set barCode(value: string) {
		this._barCode = value;
	}

	get inactivationCause(): string {
		return this._inactivationCause;
	}

	set inactivationCause(value: string) {
		this._inactivationCause = value;
	}

	get activationCause(): string {
		return this._activationCause;
	}

	set activationCause(value: string) {
		this._activationCause = value;
	}

	get stockQuantity(): number {
		return this._stockQuantity;
	}

	set stockQuantity(value: number) {
		this._stockQuantity = value;
	}

	public increaseStock(quantity: number): void {
		if (quantity <= 0) {
			throw new Error("Quantidade deve ser positiva");
		}
		this._stockQuantity += quantity;
	}

	public decreaseStock(quantity: number): void {
		if (quantity <= 0) {
			throw new Error("Quantidade deve ser positiva");
		}
		if (this._stockQuantity < quantity) {
			throw new Error("Estoque insuficiente");
		}
		this._stockQuantity -= quantity;
	}

	public isInStock(quantity: number = 1): boolean {
		return this._stockQuantity >= quantity;
	}
}
