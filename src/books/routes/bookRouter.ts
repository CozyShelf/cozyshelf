import { Router, Request, Response } from "express";
import { BookControllerFactory } from "../factories/BookControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const bookRouter = Router();
bookRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const controller = new BookControllerFactory().make();

bookRouter.get("/", async (req: Request, res: Response) =>
	controller.renderAllBooksWithPagination(req, res)
);

bookRouter.get("/:id", async (req: Request, res: Response) => {
	controller.renderBookDetails(req, res)
});

export default bookRouter;
