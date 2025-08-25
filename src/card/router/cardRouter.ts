import { Request, Response, Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const cardRouter = Router();
cardRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

//const cardController: CardController = new CardControllerFactory().make();

cardRouter.post("/", async (req: Request, res: Response) => {
	//await cardController.create(req, res);
});

cardRouter.get("/", (req: Request, res: Response) => {
	res.render("cardTable", {
		title: "Meus Cartões",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "card",
		isAdmin: false,
	});
});

cardRouter.get("/new", (req: Request, res: Response) => {
	res.render("cardDetails", {
		title: "Novo Cartão",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "card",
		isAdmin: false,
	});
});

cardRouter.get("/:id", (req: Request, res: Response) => {
	res.render("cardDetails", {
		title: "Editar Cartão",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "card",
		isAdmin: false,
	});
});

cardRouter.put("/:id", async (req: Request, res: Response) => {
	//await cardController.update(req, res);
});

cardRouter.delete("/:id", async (req: Request, res: Response) => {
	//await cardController.delete(req, res);
});

export default cardRouter;
