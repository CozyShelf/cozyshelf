import { Request, Response, Router } from "express";
import { BookControllerFactory } from "../factories/BookControllerFactory";

const bookAPIRouter = Router();
const bookController = new BookControllerFactory().make();

bookAPIRouter.get("/", async (req: Request, res: Response) =>
	await bookController.getAll(req, res)
);

export default bookAPIRouter;
