import { DataSource } from "typeorm";
import BookModel, { BookStatus } from "../../../../../books/model/BookModel";
import CategoryModel from "../../../../../books/model/CategoryModel";
import PublisherModel from "../../../../../books/model/PublisherModel";
import AuthorModel from "../../../../../books/model/AuthorModel";
import PricingGroupModel from "../../../../../books/model/PricingGroupModel";
import books from "./books";

export default class BookSeeder {
	static async execute(dataSource: DataSource): Promise<void> {
		const bookDao = dataSource.getRepository(BookModel);
		const categoryDao = dataSource.getRepository(CategoryModel);
		const publisherDao = dataSource.getRepository(PublisherModel);
		const authorDao = dataSource.getRepository(AuthorModel);
		const pricingGroupDao = dataSource.getRepository(PricingGroupModel);

		for (const book of books) {
			let author = await authorDao.findOneBy(book.author);
			if (!author) {
				author = new AuthorModel(book.author._name);
			}

			let publisher = await publisherDao.findOneBy(book.publisher);
			if (!publisher) {
				publisher = new PublisherModel(book.publisher._description);
			}

			const categories: CategoryModel[] = [];
			for (const catName of book.categories) {
				let category = await categoryDao.findOneBy({ _description: catName });
				if (!category) {
					category = new CategoryModel(catName);
				}
				categories.push(category);
			}

			let pricingGroup = await pricingGroupDao.findOneBy({
				_description: "default",
			});
			if (!pricingGroup) {
				pricingGroup = new PricingGroupModel("default", 0);
			}

			const bookEntity = new BookModel(
				Number(book.price),
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
				categories,
				author,
				publisher,
				pricingGroup,
				BookStatus.ACTIVE,
				book.coverPath,
				(book as any).stockQuantity || Math.floor(Math.random() * 50) + 5 // Quantidade aleatória entre 5 e 54
			);

			await bookDao.save(bookEntity);
		}
	}
}
