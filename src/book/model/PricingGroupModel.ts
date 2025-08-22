import { Column, Entity } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class PricingGroupModel extends GenericModel{
    @Column({type: "double"})
    _percentage!: number;

    @Column({type: "varchar", length: 200})
    _description!: string;

    constructor(description: string, percentage: number){
        super();
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