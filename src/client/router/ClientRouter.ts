import { Request, Response, Router } from "express";
import ClientController from "../controller/ClientController";
import { ClientControllerFactory } from "../../generic/factories/ClientControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const clientRouter = Router();
clientRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const clientController: ClientController = new ClientControllerFactory().make();

clientRouter.post("/", async (req: Request, res: Response) => {
	await clientController.create(req, res);
});

clientRouter.get("/", async (req: Request, res: Response) => {
	await clientController.getAll(req, res);
});

clientRouter.get("/register", (req: Request, res: Response) => {
	res.render("clientRegistration", {
		title: "Cadastro de Clientes"
	});
});

clientRouter.get("/:id", async (req: Request, res: Response) => {
	await clientController.getById(req, res);
});

clientRouter.put("/:id", async (req: Request, res: Response) => {
	await clientController.update(req, res);
});

clientRouter.delete("/:id", async (req: Request, res: Response) => {
	await clientController.delete(req, res);
});

export default clientRouter;
