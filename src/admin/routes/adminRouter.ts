import { Router, Request, Response } from "express";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { ClientControllerFactory } from "../../client/factories/ClientControllerFactory";

const adminRouter = Router();
adminRouter.use(
	ConfigDynamicPaths.configViewsPath([
		path.join(__dirname, "../views"),
		path.join(__dirname, "../../order/views"),
		path.join(__dirname, "../../client/views")
	])
);

const bookController = new BookControllerFactory().make();
const clientController = new ClientControllerFactory().make();


adminRouter.get("/orders", (_: Request, res: Response) => {
	res.render("ordersTable", {
		title: "Pedidos",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "orders",
		isAdmin: true,
	});
});

adminRouter.get("/orders/exchange-orders", (_: Request, res: Response) => {
	res.render("exchangeOrdersTable", {
		title: "Pedidos de Troca",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "exchange-orders",
		isAdmin: true,
	});
});

adminRouter.get("/orders/:id", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);
	res.render("orderDetails", {
		title: "Detalhes do Pedido",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		isNewOrder: false,
		books,
		currentUrl: "orders",
		isAdmin: true,
	});
});

adminRouter.get("/stock", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	res.render("stockTable", {
		title: "Estoque",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "stock",
		isAdmin: true,
		books,
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
		layout: "defaultLayoutAdmin",
		currentUrl: "dashboard",
		isAdmin: true,
		books,
		labels,
		salesHistory,
	});
});

adminRouter.get("/clients", async (req: Request, res: Response) => {
	await clientController.renderClientTable(req, res);
});

adminRouter.get("/clients/:id", async (req: Request, res: Response) => {
	await clientController.renderClientDetailsAdmin(req, res);
});


export default adminRouter;
