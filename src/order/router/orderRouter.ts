import { Router, Request, Response } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import { OrderControllerFactory } from "../factory/OrderControllerFactory";

const orderRouter = Router();
orderRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const orderController = new OrderControllerFactory().make();


orderRouter.get("/", async (req: Request, res: Response) => {
	await orderController.renderOrdersTable(req, res);
});

orderRouter.get("/:id", async (req: Request, res: Response) => {
	await orderController.renderOrderDetails(req, res);
});

export default orderRouter;
