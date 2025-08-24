import { Router, Request, Response } from "express";
import { BookControllerFactory } from "../factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const bookRouter = Router();
bookRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

bookRouter.get("/", async (req: Request, res: Response) => {
	const controller = new BookControllerFactory().make();
	const books = await controller.getAll(req, res);

	res.render("books", {
		title: "Explore nosso catálogo",
		books,
	});
});

export default bookRouter;
