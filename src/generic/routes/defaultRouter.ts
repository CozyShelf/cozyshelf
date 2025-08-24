import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/clientRouter";
import addressRouter from "../../address/router/addressRouter";
import cardRouter from "../../card/router/cardRouter";
import orderRouter from "../../order/router/OrderRouter";
import couponsRouter from "../../coupons/router/CouponsRouter";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import bookRouter from "../../books/routes/bookRouter";

const defaultRouter = Router();

defaultRouter.get("/", async (req: Request, res: Response) => {
	const bookController = new BookControllerFactory().make();
	const books = await bookController.getAll(req, res);

	res.render("homePage", {
		title: "Seja bem vindo !",
		currentHeaderTab: "home",
		books,
	});
});

defaultRouter.get("/shopping-cart", async (req: Request, res: Response) => {
	const bookController = new BookControllerFactory().make();
	const books = await bookController.getById(req, res);

	res.render("shoppingCart", {
		title: "Carrinho de Compras",
		books: [books],
		coupons: [],
	});
});

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);
defaultRouter.use("/orders", orderRouter);
defaultRouter.use("/coupons", couponsRouter);
defaultRouter.use("/books", bookRouter);

export default defaultRouter;
