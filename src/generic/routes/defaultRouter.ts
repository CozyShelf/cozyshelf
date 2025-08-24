import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/ClientRouter";
import addressRouter from "../../address/router/AddressRouter";
import cardRouter from "../../card/router/CardRouter";
import orderRouter from "../../order/router/OrderRouter";
import couponsRouter from "../../coupons/router/CouponsRouter";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";

const defaultRouter = Router();

defaultRouter.get("/", async (req: Request, res: Response) => {
	const bookController = new BookControllerFactory().make();
	const books = await bookController.getAll(req, res);

	res.render("homePage", {
		title: "Seja bem vindo !",
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

export default defaultRouter;
