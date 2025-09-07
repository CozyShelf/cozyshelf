import { Request, Response, Router } from "express";
import ClientController from "../controller/ClientController";
import { ClientControllerFactory } from "../factories/ClientControllerFactory";
const clientAPIRouter = Router();

const clientController: ClientController = new ClientControllerFactory().make();

clientAPIRouter.post("/", async (req: Request, res: Response) => {
	console.log("Received POST /clients/ request with body:", req.body);
	await clientController.create(req, res);
});

clientAPIRouter.get("/", async (req: Request, res: Response) => {
	await clientController.getAll(req, res);
});

clientAPIRouter.get("/:id", async (req: Request, res: Response) => {
	await clientController.getById(req, res);
});

clientAPIRouter.put("/:id", async (req: Request, res: Response) => {
	await clientController.update(req, res);
});

clientAPIRouter.put("/:id/password", async (req: Request, res: Response) => {
	await clientController.updatePassword(req, res);
});

clientAPIRouter.delete("/:id", async (req: Request, res: Response) => {
	await clientController.delete(req, res);
});

export default clientAPIRouter;
