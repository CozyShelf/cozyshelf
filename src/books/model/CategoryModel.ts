import { Column, Entity, ManyToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "./BookModel";

@Entity()
export default class CategoryModel extends GenericModel{
    @Column({type: "varchar", length: 200})
    _description!: string;

    @ManyToMany(() => BookModel, book => book.categories)
    books!: BookModel[];

    constructor(description: string){
        super();
        this._description = description;
    }

    get description(): string{
        return this._description;
    }

    set description(value: string){
        this._description = value;
    }

}