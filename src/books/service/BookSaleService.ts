import BookSaleDAO from "../dao/BookSaleDAO";
import BookSaleModel from "../model/BookSaleModel";
import BookSale from "../domain/BookSale";
import BookSaleDTO from "../dto/BookSaleDTO";
import BookDAO from "../dao/BookDAO";

export interface ChartDataset {
	label: string;
	data: number[];
	fill: boolean;
	borderColor: string;
	tension: number;
}

export interface SalesChartData {
	datasets: ChartDataset[];
	hasData: boolean;
}

export interface CategorySalesData {
	category: string;
	year: number;
	month: number;
	totalQuantity: number;
}

export default class BookSaleService {
	private bookSaleDAO: BookSaleDAO;
	private bookDAO: BookDAO;

	constructor(dao: BookSaleDAO, bookDAO: BookDAO) {
		this.bookSaleDAO = dao;
		this.bookDAO = bookDAO;
	}

	async registerSale(
		bookId: string,
		quantity: number,
		unitPrice: number
	): Promise<BookSaleDTO> {
		const book = await this.bookDAO.findById(bookId);

		if (!book) {
			throw new Error("Livro não encontrado");
		}

		const bookSale = new BookSale(bookId, quantity, new Date(), unitPrice);

		const bookSaleModel = BookSaleModel.fromEntity(bookSale, book);
		const savedModel = await this.bookSaleDAO.save(bookSaleModel);

		return BookSaleDTO.fromEntity(savedModel.toEntity());
	}

	async getSalesByBookId(bookId: string): Promise<BookSaleDTO[]> {
		const sales = await this.bookSaleDAO.findByBookId(bookId);
		return sales.map((sale) => BookSaleDTO.fromEntity(sale.toEntity()));
	}

	async getSalesByDateRange(
		startDate: Date,
		endDate: Date
	): Promise<BookSaleDTO[]> {
		const sales = await this.bookSaleDAO.findByDateRange(startDate, endDate);
		return sales.map((sale) => BookSaleDTO.fromEntity(sale.toEntity()));
	}

	async getAllSales(): Promise<BookSaleDTO[]> {
		const sales = await this.bookSaleDAO.findAll();
		return sales.map((sale) => BookSaleDTO.fromEntity(sale.toEntity()));
	}

	async getSaleById(id: string): Promise<BookSaleDTO | null> {
		const sale = await this.bookSaleDAO.findById(id);
		if (!sale) {
			return null;
		}
		return BookSaleDTO.fromEntity(sale.toEntity());
	}

	async getBookSalesStatistics(bookId: string): Promise<{
		totalQuantity: number;
		totalRevenue: number;
	}> {
		const totalQuantity = await this.bookSaleDAO.getTotalQuantitySoldByBookId(
			bookId
		);
		const totalRevenue = await this.bookSaleDAO.getTotalRevenueByBookId(bookId);

		return {
			totalQuantity,
			totalRevenue,
		};
	}

	async getMostSoldBooks(limit: number = 10): Promise<any[]> {
		return await this.bookSaleDAO.getMostSoldBooks(limit);
	}

	async getSalesByCategory(startDate: Date, endDate: Date): Promise<any[]> {
		return await this.bookSaleDAO.getSalesByCategory(startDate, endDate);
	}

	async getSalesByCategoryAndMonth(
		startDate: Date,
		endDate: Date
	): Promise<CategorySalesData[]> {
		return await this.bookSaleDAO.getSalesByCategoryAndMonth(
			startDate,
			endDate
		);
	}

	async getSalesChartDataByCategory(
		startDate: Date,
		endDate: Date,
		labels: string[]
	): Promise<SalesChartData> {
		const categorySalesData = await this.getSalesByCategoryAndMonth(
			startDate,
			endDate
		);

		const categoriesMap = new Map<string, Map<string, number>>();

		categorySalesData.forEach((data) => {
			const categoryName = data.category || "Sem categoria";
			const monthKey = `${data.year}-${String(data.month).padStart(2, "0")}`;

			if (!categoriesMap.has(categoryName)) {
				categoriesMap.set(categoryName, new Map<string, number>());
			}

			const monthMap = categoriesMap.get(categoryName)!;
			monthMap.set(monthKey, data.totalQuantity);
		});

		const datasets = Array.from(categoriesMap.entries()).map(
			([categoryName, monthMap]) => {
				const monthlySales = labels.map((label) => {
					const [monthName, year] = label.split("/");
					const monthIndex =
						[
							"Jan",
							"Fev",
							"Mar",
							"Abr",
							"Mai",
							"Jun",
							"Jul",
							"Ago",
							"Set",
							"Out",
							"Nov",
							"Dez",
						].indexOf(monthName) + 1;
					const monthKey = `${year}-${String(monthIndex).padStart(2, "0")}`;

					return monthMap.get(monthKey) || 0;
				});

				return {
					label: categoryName,
					data: monthlySales,
					fill: false,
					borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
					tension: 0.3,
				};
			}
		);

		return {
			datasets,
			hasData: categorySalesData.length > 0,
		};
	}

	async getSalesChartDataByBook(
		startDate: Date,
		endDate: Date,
		labels: string[],
		limit: number = 10
	): Promise<SalesChartData> {
		const sales = await this.getSalesByDateRange(startDate, endDate);
		const mostSoldBooks = await this.getMostSoldBooks(limit);
		const booksWithSalesInPeriod = [
			...new Set(sales.map((sale) => sale.bookId)),
		];

		const relevantBooks = mostSoldBooks
			.filter((book) => booksWithSalesInPeriod.includes(book.bookId))
			.slice(0, limit);

		const datasets = relevantBooks.map((bookData) => {
			const bookSales = sales.filter((sale) => sale.bookId === bookData.bookId);

			const monthlySales = labels.map((_, index) => {
				const monthDate = new Date(
					startDate.getFullYear(),
					startDate.getMonth() + index,
					1
				);

				const monthSales = bookSales.filter((sale) => {
					const saleDate = new Date(sale.saleDate);
					return (
						saleDate.getMonth() === monthDate.getMonth() &&
						saleDate.getFullYear() === monthDate.getFullYear()
					);
				});

				return monthSales.reduce((sum, sale) => sum + sale.quantity, 0);
			});

			return {
				label: bookData.bookTitle,
				data: monthlySales,
				fill: false,
				borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				tension: 0.3,
			};
		});

		return {
			datasets,
			hasData: relevantBooks.length > 0 && sales.length > 0,
		};
	}

	async deleteSale(id: string): Promise<void> {
		await this.bookSaleDAO.softDelete(id);
	}
}
