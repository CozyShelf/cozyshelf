import { Column, Entity, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import CategoryModel from "./CategoryModel";
import PublisherModel from "./PublisherModel";
import AuthorModel from "./AuthorModel";
import PricingGroupModel from "./PricingGroupModel";
import ImagesModel from "../../generic/model/ImagesModel";

export enum BookStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

@Entity()
export default class BookModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    saleValue!: number;

    @Column({ type: "varchar", length: 200 })
    title!: string;

    @Column({ type: "text" })
    synopsis!: string;

    @Column({ type: "varchar", length: 20 })
    isbn!: string;

    @Column({ type: "int" })
    pageNumber!: number;

    @Column({ type: "int" })
    year!: number;

    @Column({ type: "varchar", length: 50 })
    edition!: string;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    height!: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    width!: number;

    @Column({ type: "decimal", precision: 7, scale: 3 })
    weight!: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    depth!: number;

    @Column({ type: "varchar", length: 30 })
    barCode!: string;

    @Column({ type: "text" })
    justificationInitiation!: string;

    @Column({ type: "text" })
    justificationActivation!: string;

    @ManyToMany(() => CategoryModel)
    @JoinTable()
    categories!: CategoryModel[];

    @ManyToOne(() => AuthorModel)
    author!: AuthorModel;

    @ManyToOne(() => PublisherModel)
    publisher!: PublisherModel;

    @ManyToOne(() => PricingGroupModel, pricingGroup => pricingGroup.books)
    pricingGroup!: PricingGroupModel;

    @Column({ type: "enum", enum: BookStatus })
    status!: BookStatus;

    @OneToMany(() => ImagesModel, image => image.book, { cascade: true })
    images!: ImagesModel[];
}