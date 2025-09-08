import { Router, Request, Response } from "express";
import { AddressControllerFactory } from "../factories/AddressControllerFactory";

const addressAPIRouter = Router();
const addressController = new AddressControllerFactory().make();

addressAPIRouter.post("/", async (req: Request, res: Response) => {
	await addressController.create(req, res);
});

addressAPIRouter.get("/client/:id", async (req: Request, res: Response) => {
	await addressController.getAll(req, res);
});

addressAPIRouter.get("/:id", async (req: Request, res: Response) => {
	await addressController.getById(req, res);
});

addressAPIRouter.put("/:id", async (req: Request, res: Response) => {
	await addressController.update(req, res);
});

addressAPIRouter.delete("/:id", async (req: Request, res: Response) => {
	await addressController.delete(req, res);
});

export default addressAPIRouter;
