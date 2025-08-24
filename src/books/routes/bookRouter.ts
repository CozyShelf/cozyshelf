import { Router, Request, Response } from "express";
import { BookControllerFactory } from "../factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const bookRouter = Router();
bookRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const controller = new BookControllerFactory().make();

bookRouter.get("/", async (req: Request, res: Response) => {
	const books = await controller.getAll(req, res);

	res.render("listAllBooks", {
		title: "Explore nosso catálogo",
		currentHeaderTab: "books",
		books,
	});
});

bookRouter.get("/:id", async (req: Request, res: Response) => {
	const book = await controller.getById(req, res);

	res.render("bookDetails", {
		title: `Detalhes do livro - ${book.name}`,
		currentHeaderTab: "books",
		book,
	});
});

export default bookRouter;
