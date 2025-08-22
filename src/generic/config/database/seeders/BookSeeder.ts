import BookModel from "../../../../book/model/BookModel";

export default class BookSeeder {
    static async execute(dataSource: DataSource): Promise<void> {
        const bookDao = dataSource.getRepository(BookModel)


    }
}