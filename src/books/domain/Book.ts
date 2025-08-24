export default class Book {
	_id: number;
	_name: string;
	_author: string;
	_coverPath: string;
	_price: number;
	_rating: number;
	_resume: string;
	_isbn: string;
	_numberOfPages: number;
	_category: string;
	_year: number;
	_edition: string;
	_height: number;
	_width: number;
	_weight: number;
	_thickness: number;
	_barCode: string;
	_inactivationCause: string;
	_activationCause: string;

	constructor(
		id: number,
		name: string,
		author: string,
		coverPath: string,
		price: number,
		rating: number,
		resume: string = "",
		isbn: string = "",
		numberOfPages: number = 0,
		category: string = "",
		year: number = 0,
		edition: string = "",
		height: number = 0,
		width: number = 0,
		weight: number = 0,
		thickness: number = 0,
		barCode: string = "",
		inactivationCause: string = "",
		activationCause: string = ""
	) {
		this._id = id;
		this._name = name;
		this._author = author;
		this._coverPath = coverPath;
		this._price = price;
		this._rating = rating;
		this._resume = resume;
		this._isbn = isbn;
		this._numberOfPages = numberOfPages;
		this._category = category;
		this._year = year;
		this._edition = edition;
		this._height = height;
		this._width = width;
		this._weight = weight;
		this._thickness = thickness;
		this._barCode = barCode;
		this._inactivationCause = inactivationCause;
		this._activationCause = activationCause;
	}

	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
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

	get rating(): number {
		return this._rating;
	}

	set rating(value: number) {
		this._rating = value;
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

	get category(): string {
		return this._category;
	}

	set category(value: string) {
		this._category = value;
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
}
