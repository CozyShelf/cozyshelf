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
		title: "Pedidos",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "orders",
		isAdmin: true
	});
});

orderRouter.get("/admin/exchange-orders", (req: Request, res: Response) => {
	res.render("exchangeOrdersTable", {
		title: "Pedidos de Troca",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "exchange-orders",
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
		layout: "defaultLayoutAdmin",
		isNewOrder: false,
		books: books,
		currentUrl: "orders",
		isAdmin: true
	});
});

export default orderRouter;
