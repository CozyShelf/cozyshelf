export default class PaginationDTO<T> {
	_elements: T[];
	_currentPage: number;
	_limit: number;
	_offset: number;
	_nextPage: number = 1;

	public constructor(
		elements: T[],
		currentPage: number,
		limit: number,
		offset: number
	) {
		this._elements = elements;
		this._currentPage = currentPage;
		this._limit = limit;
		this._offset = offset;
	}

	get elements(): T[] {
		return this._elements;
	}

	set elements(value: T[]) {
		this._elements = value;
	}

	get nextPage(): number {
		return this._nextPage;
	}

	calculateNextPage() {
		this._nextPage = this._offset + this._limit;
	}

	static calculateOffset(page: number, limit: number) {
		return (page - 1) * limit;
	}
}
