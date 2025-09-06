export default class Publisher{
    _description!: string;

    constructor(description: string){
        this._description = description;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string){
        this._description = value;
    }
}
