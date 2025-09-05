import { Router, Request, Response } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";

const stockRouter = Router();
stockRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const bookController = new BookControllerFactory().make();

stockRouter.get("/", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	res.render("stockTable", {
		title: "Estoque",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "stock",
		books: books
	});
});

export default stockRouter;
