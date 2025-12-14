import { Request, Response, Router } from "express";
import ClientController from "../controller/ClientController";
import { ClientControllerFactory } from "../factories/ClientControllerFactory";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const clientRouter = Router();
clientRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const clientController: ClientController = new ClientControllerFactory().make();

clientRouter.get("/register/", (req: Request, res: Response) => {
	clientController.renderClientRegistration(req, res);
});

clientRouter.get("/:id/password", (req: Request, res: Response) => {
	clientController.renderPasswordDetails(req, res);
});

clientRouter.get("/:id/", async (req: Request, res: Response) => {
	await clientController.renderClientDetails(req, res);
});

export default clientRouter;
