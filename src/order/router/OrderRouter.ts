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
		layout: "detailsLayout",
		currentUrl: "orders",
	});
});

orderRouter.get("/:id", async (req: Request, res: Response) => {
    const books = await bookController.getById(req, res);
    res.render("orderDetails", {
        title: "Detalhes do Pedido",
        layout: "detailsLayout",
        isNewOrder: false,
        books: [books],
        currentUrl: "orders",
    });
});

export default orderRouter;