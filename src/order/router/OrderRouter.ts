import { Router, Request, Response } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const orderRouter = Router();
orderRouter.use(
    ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

orderRouter.get("/", (req: Request, res: Response) => {
    res.render("ordersTable", {
		title: "Meus Pedidos",
		layout: "detailsLayout",
		currentUrl: "orders",
	});
});


orderRouter.get("/:id", (req: Request, res: Response) => {
    res.render("orderDetails", {
        title: "Detalhes do Pedido",
        layout: "detailsLayout",
        isNewOrder: false,
        currentUrl: "orders",
    });
});

export default orderRouter;