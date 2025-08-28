import { Column, Entity, OneToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "./BookModel";

@Entity()
export default class PricingGroupModel extends GenericModel{
    @Column({type: "int"})
    _percentage!: number;

    @Column({type: "varchar", length: 200})
    _description!: string;

    @OneToMany(() => BookModel, book => book.pricingGroup)
    books!: BookModel[];

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