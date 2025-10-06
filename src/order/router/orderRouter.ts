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
		isAdmin: false,
	});
});

orderRouter.get("/:id", async (req: Request, res: Response) => {
	await bookController.renderBooksForOrderDetails(req, res);
});

export default orderRouter;
