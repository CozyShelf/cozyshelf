import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import CategoryModel from "./CategoryModel";
import PublisherModel from "./PublisherModel";
import AuthorModel from "./AuthorModel";
import PricingGroupModel from "./PricingGroupModel";
import Book from "../domain/Book";

export enum BookStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
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

	@ManyToMany(() => CategoryModel, { cascade: true, eager: true })
	@JoinTable()
	categories!: CategoryModel[];

	@ManyToOne(() => AuthorModel, { cascade: true, eager: true })
	author!: AuthorModel;

	@ManyToOne(() => PublisherModel, { cascade: true, eager: true })
	publisher!: PublisherModel;

	@ManyToOne(() => PricingGroupModel, (pricingGroup) => pricingGroup.books, {
		cascade: true,
		eager: true,
	})
	pricingGroup!: PricingGroupModel;

	@Column({ type: "enum", enum: BookStatus })
	status!: BookStatus;

	@Column({ type: "varchar" })
	coverPath!: string;

	@Column({ type: "int", default: 0 })
	stockQuantity!: number;

	constructor(
		saleValue: number,
		title: string,
		synopsis: string,
		isbn: string,
		pageNumber: number,
		year: number,
		edition: string,
		height: number,
		width: number,
		weight: number,
		depth: number,
		barCode: string,
		justificationInitiation: string,
		justificationActivation: string,
		categories: CategoryModel[],
		author: AuthorModel,
		publisher: PublisherModel,
		pricingGroup: PricingGroupModel,
		status: BookStatus,
		coverPath: string,
		stockQuantity: number = 0
	) {
		super();
		this.saleValue = saleValue;
		this.title = title;
		this.synopsis = synopsis;
		this.isbn = isbn;
		this.pageNumber = pageNumber;
		this.year = year;
		this.edition = edition;
		this.height = height;
		this.width = width;
		this.weight = weight;
		this.depth = depth;
		this.barCode = barCode;
		this.justificationInitiation = justificationInitiation;
		this.justificationActivation = justificationActivation;
		this.categories = categories;
		this.author = author;
		this.publisher = publisher;
		this.pricingGroup = pricingGroup;
		this.status = status;
		this.coverPath = coverPath;
		this.stockQuantity = stockQuantity;
	}

	toEntity() {
		const categories = this.categories.map((cat) => cat.toEntity());

		const book = new Book(
			this.title,
			this.author.name,
			this.coverPath,
			this.saleValue,
			this.synopsis,
			this.isbn,
			this.pageNumber,
			categories,
			this.year,
			this.edition,
			this.publisher.description,
			this.height,
			this.width,
			this.weight,
			this.depth,
			this.barCode,
			this.justificationInitiation,
			this.justificationActivation,
			this.stockQuantity
		);

		book.id = this.id;
		return book;
	}

	static fromEntity(book: Book): BookModel {
		const categoryModels = book.categories.map((cat) => new CategoryModel(cat));

		return new BookModel(
			book.price,
			book.name,
			book.resume,
			book.isbn,
			book.numberOfPages,
			book.year,
			book.edition,
			book.height,
			book.width,
			book.weight,
			book.thickness,
			book.barCode,
			book.inactivationCause,
			book.activationCause,
			categoryModels,
			new AuthorModel(book.author),
			new PublisherModel(book.publisher),
			new PricingGroupModel("default", 0),
			book.isActive ? BookStatus.ACTIVE : BookStatus.INACTIVE,
			book.coverPath,
			book.stockQuantity
		);
	}
}
