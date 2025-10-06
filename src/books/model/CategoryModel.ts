import { Column, Entity, ManyToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import BookModel from "./BookModel";
import BookCategory from "../domain/enums/BookCategory";

@Entity()
export default class CategoryModel extends GenericModel {
	@Column({ type: "varchar", length: 200 })
	_description!: string;

	@ManyToMany(() => BookModel, (book) => book.categories)
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

	toEntity(): BookCategory {
		return CategoryModel.findMatchingCategory(this.description);
	}

	static findMatchingCategory(description: string): BookCategory {
		const normalizedDescription = description.toLowerCase().trim();

		const exactMatch = Object.values(BookCategory).find(
			(categoryValue) =>
				categoryValue.toLowerCase().trim() === normalizedDescription
		);

		if (exactMatch) {
			return exactMatch as BookCategory;
		}

		const partialMatch = Object.values(BookCategory).find((categoryValue) => {
			const normalizedCategory = categoryValue.toLowerCase().trim();
			return (
				normalizedCategory.includes(normalizedDescription) ||
				normalizedDescription.includes(normalizedCategory)
			);
		});

		if (partialMatch) {
			return partialMatch as BookCategory;
		}

		throw new Error(
			`Categoria não encontrada: "${description}". ` +
				`Categorias válidas: ${Object.values(BookCategory).join(", ")}`
		);
	}
}
