import { DataSource, Repository } from "typeorm";
import BookSaleModel from "../model/BookSaleModel";
import { CategorySalesData } from "../service/BookSaleService";

export default class BookSaleDAO {
	private dataSource: DataSource;
	private repository: Repository<BookSaleModel>;

	constructor(dataSource: DataSource) {
		this.dataSource = dataSource;
		this.repository = this.dataSource.getRepository(BookSaleModel);
	}

	async save(bookSale: BookSaleModel): Promise<BookSaleModel> {
		return await this.repository.save(bookSale);
	}

	async findById(id: string): Promise<BookSaleModel | null> {
		return await this.repository.findOne({
			where: { id },
		});
	}

	async findByBookId(bookId: string): Promise<BookSaleModel[]> {
		return await this.repository.find({
			where: {
				book: { id: bookId },
				isActive: true,
			},
			order: {
				saleDate: "DESC",
			},
		});
	}

	async findByDateRange(
		startDate: Date,
		endDate: Date
	): Promise<BookSaleModel[]> {
		const adjustedEndDate = new Date(endDate);
		adjustedEndDate.setHours(23, 59, 59, 999);

		return await this.repository
			.createQueryBuilder("bookSale")
			.leftJoinAndSelect("bookSale.book", "book")
			.where("bookSale.saleDate >= :startDate", { startDate })
			.andWhere("bookSale.saleDate <= :endDate", { endDate: adjustedEndDate })
			.andWhere("bookSale.isActive = :isActive", { isActive: true })
			.orderBy("bookSale.saleDate", "DESC")
			.getMany();
	}

	async findAll(): Promise<BookSaleModel[]> {
		return await this.repository.find({
			where: { isActive: true },
			order: {
				saleDate: "DESC",
			},
		});
	}

	async getTotalQuantitySoldByBookId(bookId: string): Promise<number> {
		const result = await this.repository
			.createQueryBuilder("bookSale")
			.select("SUM(bookSale.quantity)", "total")
			.where("bookSale.book.id = :bookId", { bookId })
			.andWhere("bookSale.isActive = :isActive", { isActive: true })
			.getRawOne();

		return result?.total || 0;
	}

	async getTotalRevenueByBookId(bookId: string): Promise<number> {
		const result = await this.repository
			.createQueryBuilder("bookSale")
			.select("SUM(bookSale.quantity * bookSale.unitPrice)", "total")
			.where("bookSale.book.id = :bookId", { bookId })
			.andWhere("bookSale.isActive = :isActive", { isActive: true })
			.getRawOne();

		return result?.total || 0;
	}

	async getMostSoldBooks(limit: number = 10): Promise<any[]> {
		return await this.repository
			.createQueryBuilder("bookSale")
			.leftJoinAndSelect("bookSale.book", "book")
			.select("book.id", "bookId")
			.addSelect("book.title", "bookTitle")
			.addSelect("SUM(bookSale.quantity)", "totalQuantity")
			.addSelect("SUM(bookSale.quantity * bookSale.unitPrice)", "totalRevenue")
			.where("bookSale.isActive = :isActive", { isActive: true })
			.groupBy("book.id")
			.addGroupBy("book.title")
			.orderBy('"totalQuantity"', "DESC")
			.limit(limit)
			.getRawMany();
	}

	async getSalesByCategory(
		startDate: Date,
		endDate: Date
	): Promise<{ category: string; totalQuantity: number }[]> {
		const adjustedEndDate = new Date(endDate);
		adjustedEndDate.setHours(23, 59, 59, 999);

		const results = await this.repository
			.createQueryBuilder("bookSale")
			.select("category.description", "category")
			.addSelect("SUM(bookSale.quantity)", "totalQuantity")
			.innerJoin("bookSale.book", "book")
			.innerJoin("book.categories", "category")
			.where("bookSale.saleDate BETWEEN :startDate AND :endDate", {
				startDate,
				endDate: adjustedEndDate,
			})
			.groupBy("category.description")
			.orderBy('"totalQuantity"', "DESC")
			.getRawMany();

		return results.map((result) => ({
			category: result.category,
			totalQuantity: parseInt(result.totalQuantity, 10),
		}));
	}

	async getSalesByCategoryAndMonth(
		startDate: Date,
		endDate: Date
	): Promise<CategorySalesData[]> {
		const adjustedEndDate = new Date(endDate);
		adjustedEndDate.setHours(23, 59, 59, 999);

		const results = await this.repository
			.createQueryBuilder("bookSale")
			.select("category.description", "category")
			.addSelect("EXTRACT(YEAR FROM bookSale.saleDate)", "year")
			.addSelect("EXTRACT(MONTH FROM bookSale.saleDate)", "month")
			.addSelect("SUM(bookSale.quantity)", "totalQuantity")
			.innerJoin("bookSale.book", "book")
			.innerJoin("book.categories", "category")
			.where("bookSale.saleDate BETWEEN :startDate AND :endDate", {
				startDate,
				endDate: adjustedEndDate,
			})
			.andWhere("category.isActive = :isActive", { isActive: true })
			.groupBy("category.description")
			.addGroupBy("EXTRACT(YEAR FROM bookSale.saleDate)")
			.addGroupBy("EXTRACT(MONTH FROM bookSale.saleDate)")
			.orderBy("category.description", "ASC")
			.addOrderBy('"year"', "ASC")
			.addOrderBy('"month"', "ASC")
			.getRawMany();

		return results.map((result) => ({
			category: result.category,
			year: parseInt(result.year, 10),
			month: parseInt(result.month, 10),
			totalQuantity: parseInt(result.totalQuantity, 10),
		}));
	}

	async softDelete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}
}
