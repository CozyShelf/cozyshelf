import { Router, Request, Response } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";

const orderRouter = Router();
orderRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const bookController = new BookControllerFactory().make();

orderRouter.get("/", (req: Request, res: Response) => {
	res.render("ordersTable", {
		title: "Meus Pedidos",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "orders",
		isAdmin: false
	});
});

orderRouter.get("/admin", (req: Request, res: Response) => {
	res.render("ordersTable", {
		title: "Meus Pedidos",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "orders",
		isAdmin: true
	});
});

orderRouter.get("/admin/dashboard", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

	const salesHistory = (books ?? []).map((book: any) => {
		const sales = labels.map(() => Math.floor(Math.random() * 50) + 10); // vendas aleatórias
		return {
			label: book.name,
			data: sales,
			fill: false,
			borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // cor aleatória
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
		salesHistory
	});
});

orderRouter.get("/admin/exchange-orders", (req: Request, res: Response) => {
	res.render("exchangeOrdersTable", {
		title: "Pedidos de Troca",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "exchange-orders",
		isAdmin: true,
	});
});

orderRouter.get("/:id", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);
	res.render("orderDetails", {
		title: "Detalhes do Pedido",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		isNewOrder: false,
		books: books,
		currentUrl: "orders",
		isAdmin: false
	});
});

orderRouter.get("/admin/:id", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);
	res.render("orderDetails", {
		title: "Detalhes do Pedido",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		isNewOrder: false,
		books: books,
		currentUrl: "orders",
		isAdmin: true
	});
});

export default orderRouter;
