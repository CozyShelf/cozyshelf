
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import BookModel from "../../books/model/BookModel";

@Entity()
export default class ImagesModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    path!: string;

    @ManyToOne(() => BookModel, book => book.images)
    book!: BookModel;
}