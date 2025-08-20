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

clientRouter.post("/", async (req: Request, res: Response) => {
	await clientController.create(req, res);
});

clientRouter.get("/", async (req: Request, res: Response) => {
	res.render("clientTable", {
		title: "Lista de Clientes",
	});
});

clientRouter.get("/register", (req: Request, res: Response) => {
	res.render("clientRegistration", {
		title: "Cadastro de Clientes",
	});
});

clientRouter.get("/:id/password", (req: Request, res: Response) => {
	res.render("passwordDetail", {
		title: "Alterar Senha",
		layout: "detailsLayout",
		currentUrl: "password",
	});
});

clientRouter.get("/:id", async (_: Request, res: Response) => {
	//await clientController.getById(req, res);
	res.render("clientDetails", {
		title: "Detalhes do Cliente",
		layout: "detailsLayout",
		currentUrl: `client`,
	});
});

clientRouter.put("/:id", async (req: Request, res: Response) => {
	await clientController.update(req, res);
});

clientRouter.delete("/:id", async (req: Request, res: Response) => {
	await clientController.delete(req, res);
});

export default clientRouter;
