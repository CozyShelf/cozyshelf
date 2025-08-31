import { Column, Entity, OneToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "./BookModel";

@Entity()
export default class PublisherModel extends GenericModel{
    @Column({ type: "varchar", length: 150 })
    _description!: string;

    @OneToMany(() => BookModel, book => book.publisher)
    books!: BookModel[];

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