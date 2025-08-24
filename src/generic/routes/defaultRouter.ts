import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/clientRouter";
import addressRouter from "../../address/router/addressRouter";
import cardRouter from "../../card/router/cardRouter";
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

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);
defaultRouter.use("/books", bookRouter);

export default defaultRouter;
