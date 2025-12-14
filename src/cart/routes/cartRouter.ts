import { Request, Response, Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import CartControllerFactory from "../factories/CartControllerFactory";

const cartRouter = Router();
cartRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const cartController = new CartControllerFactory().make();

cartRouter.get("/:clientID", async (req: Request, res: Response) => {
	await cartController.renderBooksForCart(req, res);
});

export default cartRouter;
