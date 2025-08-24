import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/ClientRouter";
import addressRouter from "../../address/router/AddressRouter";
import cardRouter from "../../card/router/CardRouter";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import bookRouter from "../../books/routes/bookRouter";

const defaultRouter = Router();

defaultRouter.get("/", async (req: Request, res: Response) => {
	const bookController = new BookControllerFactory().make();
	const allBooks = await bookController.getAll(req, res);

	const books = allBooks?.slice(0, 5);

	res.render("homePage", {
		title: "Seja bem vindo !",
		books,
	});
});

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);
defaultRouter.use("/books", bookRouter);

export default defaultRouter;
