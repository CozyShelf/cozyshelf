import { Router, Request, Response } from "express";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const adminRouter = Router();
adminRouter.use(
	ConfigDynamicPaths.configViewsPath([
		path.join(__dirname, "../views"),
		path.join(__dirname, "../../order/views"),
	])
);

const bookController = new BookControllerFactory().make();

adminRouter.get("/orders", (_: Request, res: Response) => {
	res.render("ordersTable", {
		title: "Meus Pedidos",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "orders",
		isAdmin: true,
	});
});

adminRouter.get("/orders/exchange-orders", (_: Request, res: Response) => {
	res.render("exchangeOrdersTable", {
		title: "Pedidos de Troca",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "exchange-orders",
		isAdmin: true,
	});
});

adminRouter.get("/orders/:id", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);
	res.render("orderDetails", {
		title: "Detalhes do Pedido",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		isNewOrder: false,
		books: books,
		currentUrl: "orders",
		isAdmin: true,
	});
});

adminRouter.get("/stock", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	res.render("stockTable", {
		title: "Estoque",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "stock",
		isAdmin: true,
		books: books,
	});
});

adminRouter.get("/dashboard", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

	const salesHistory = (books ?? []).map((book: any) => {
		const sales = labels.map(() => Math.floor(Math.random() * 50) + 10);
		return {
			label: book.name,
			data: sales,
			fill: false,
			borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
			tension: 0.3,
		};
	});

	res.render("dashboard", {
		title: "Dashboard - Grafico de linha de vendas",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "dashboard",
		isAdmin: true,
		books,
		labels,
		salesHistory,
	});
});

export default adminRouter;
