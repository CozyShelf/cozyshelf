import { Column, Entity } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class PublisherModel extends GenericModel{
    @Column({ type: "varchar", length: 150 })
    _description!: string;

    constructor(description: string) {
        super();
        this._description = description;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}