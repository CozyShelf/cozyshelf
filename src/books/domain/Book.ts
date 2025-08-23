export default class Book {
	_name: string;
	_author: string;
	_coverPath: string;
	_price: number;
	_rating: number;

	constructor(
		name: string,
		author: string,
		coverPath: string,
		price: number,
		rating: number
	) {
		this._name = name;
		this._author = author;
		this._coverPath = coverPath;
		this._price = price;
		this._rating = rating;
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
}
