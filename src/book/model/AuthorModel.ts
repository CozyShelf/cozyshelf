import { Column, Entity } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class AuthorModel extends GenericModel{
    @Column({ type: "varchar", length: 100 })
    _name!: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
