import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/ClientRouter";
import addressRouter from "../../address/router/AddressRouter";
import cardRouter from "../../card/router/CardRouter";
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

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);

export default defaultRouter;
