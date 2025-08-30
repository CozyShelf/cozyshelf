import { DataSource } from "typeorm";
import BookModel, { BookStatus } from "../../../../../books/model/BookModel";
import CategoryModel from "../../../../../books/model/CategoryModel";
import PublisherModel from "../../../../../books/model/PublisherModel";
import AuthorModel from "../../../../../books/model/AuthorModel";
import PricingGroupModel from "../../../../../books/model/PricingGroupModel";
import ImagesModel from "../../../../model/ImagesModel";
import books from "./books";

export default class BookSeeder {
    static async execute(dataSource: DataSource): Promise<void> {
        const bookDao = dataSource.getRepository(BookModel);
        const categoryDao = dataSource.getRepository(CategoryModel);
        const publisherDao = dataSource.getRepository(PublisherModel);
        const authorDao = dataSource.getRepository(AuthorModel);
        const pricingGroupDao = dataSource.getRepository(PricingGroupModel);
        const imagesDao = dataSource.getRepository(ImagesModel);

        for (const book of books) {
            let author = await authorDao.findOneBy(book.author);
            if (!author) {
                author = authorDao.create(book.author);
                await authorDao.save(author);
            }

            let publisher = await publisherDao.findOneBy(book.publisher);
            if (!publisher) {
                publisher = publisherDao.create(book.publisher);
                await publisherDao.save(publisher);
            }

            const categories: CategoryModel[] = [];
            for (const catName of book.categories) {
                let category = await categoryDao.findOneBy({ _description: catName });
                if (!category) {
                    category = categoryDao.create({ _description: catName });
                    await categoryDao.save(category);
                }
                categories.push(category);
            }

            let pricingGroup = await pricingGroupDao.findOneBy({ _description: "default" });
            if (!pricingGroup) {
                pricingGroup = pricingGroupDao.create({ _description: "default", _percentage: 0 });
                await pricingGroupDao.save(pricingGroup);
            }

            const image = imagesDao.create({ path: book.coverPath });
            await imagesDao.save(image);

            const bookEntity = bookDao.create({
                saleValue: book.price,
                title: book.name,
                synopsis: book.resume,
                isbn: book.isbn,
                pageNumber: book.numberOfPages,
                year: book.year,
                edition: book.edition,
                height: book.height,
                width: book.width,
                weight: book.weight,
                depth: book.thickness,
                barCode: book.barCode,
                justificationInitiation: book.inactivationCause,
                justificationActivation: book.activationCause,
                categories,
                author,
                publisher,
                pricingGroup,
                status: BookStatus.ACTIVE,
                images: [image]
            });

            await bookDao.save(bookEntity);
        }
    }
}
