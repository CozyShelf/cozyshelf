export default class Category {
    _description!: string;

    constructor(description: string) {
        this._description = description;
    }

    get name(): string {
        return this._description;
    }

    set name(value: string) {
        this._description = value;
    }
}
