import { Router, Request, Response } from "express";
import { CardControllerFactory } from "../factories/CardControllerFactory";

const cardAPIRouter = Router();
const cardController = new CardControllerFactory().make();

cardAPIRouter.post("/", async (req: Request, res: Response) => {
	await cardController.create(req, res);
});

cardAPIRouter.get("/client/:clientId", async (req: Request, res: Response) => {
	await cardController.getByClientId(req, res);
});

cardAPIRouter.get("/flags", async (req: Request, res: Response) => {
	await cardController.getAllFlags(req, res);
});

cardAPIRouter.get("/:id", async (req: Request, res: Response) => {
	await cardController.getById(req, res);
});

cardAPIRouter.put("/:id", async (req: Request, res: Response) => {
	await cardController.update(req, res);
});

cardAPIRouter.delete("/:id", async (req: Request, res: Response) => {
	await cardController.delete(req, res);
});

export default cardAPIRouter;
