import { Column, Entity, OneToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "./BookModel";

@Entity()
export default class AuthorModel extends GenericModel{
    @Column({ type: "varchar", length: 100 })
    _name!: string;

    @OneToMany(() => BookModel, book => book.author)
    books!: BookModel[];

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
