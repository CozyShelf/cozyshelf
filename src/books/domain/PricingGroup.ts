
export default class PricingGroup{
    _percentage!: number;
    _description!: string;

    constructor(description: string, percentage: number){
        this._description = description;
        this._percentage = percentage;
    }

    get description(): string {
        return this._description;
    }

    get percentage(): number {
        return this._percentage;
    }

    set description(value: string) {
        this._description = value;
    }

    set descriotion(value: number) {
        this._percentage = value;
    }
}