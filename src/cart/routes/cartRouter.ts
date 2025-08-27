import { Request, Response, Router } from "express";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const cartRouter = Router();
cartRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const bookController = new BookControllerFactory().make();

cartRouter.get("/", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	res.render("shoppingCart", {
		title: "Carrinho de Compras",
		currentHeaderTab: "cart",
		books: books,
		coupons: [],
	});
});

export default cartRouter;
