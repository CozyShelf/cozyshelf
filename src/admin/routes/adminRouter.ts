import { Router, Request, Response } from "express";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { ClientControllerFactory } from "../../client/factories/ClientControllerFactory";
import { OrderControllerFactory } from "../../order/factory/OrderControllerFactory";

// TODO: Criar routers de admin especificos para cada entidade e alterar admin router (e.g. defaultAPIRouter.ts);

const adminRouter = Router();
adminRouter.use(
	ConfigDynamicPaths.configViewsPath([
		path.join(__dirname, "../views"),
		path.join(__dirname, "../../order/views"),
		path.join(__dirname, "../../client/views"),
	])
);

const bookController = new BookControllerFactory().make();
const clientController = new ClientControllerFactory().make();
const ordersController = new OrderControllerFactory().make();

adminRouter.get("/orders", (_: Request, res: Response) => {
	ordersController.renderAdminOrdersTable(_, res);
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
	await ordersController.renderAdminOrderDetails(req, res);
});

adminRouter.get("/stock", async (req: Request, res: Response) => {
	await bookController.renderBooksForStock(req, res);
});

adminRouter.get("/dashboard", async (req: Request, res: Response) => {
	await bookController.renderBooksForDashboard(req, res);
});

adminRouter.get("/clients", async (req: Request, res: Response) => {
	await clientController.renderClientTable(req, res);
});

adminRouter.get("/clients/:id", async (req: Request, res: Response) => {
	await clientController.renderClientDetailsAdmin(req, res);
});

export default adminRouter;
