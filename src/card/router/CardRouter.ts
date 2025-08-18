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
		layout: "defaultDetailsLayout",
		currentUrl: 'card',
	});
});

cardRouter.get("/new", (req: Request, res: Response) => {
	res.render("cardDetails", {
		title: "Novo Cartão",
		layout: "defaultDetailsLayout",
		currentUrl: 'card',
	});
});

cardRouter.get("/:id", (req: Request, res: Response) => {
	res.render("cardDetails", {
		title: "Editar Cartão",
		layout: "defaultDetailsLayout",
		currentUrl: 'card',
	});
});

cardRouter.put("/:id", async (req: Request, res: Response) => {
	//await cardController.update(req, res);
});

cardRouter.delete("/:id", async (req: Request, res: Response) => {
	//await cardController.delete(req, res);
});

export default cardRouter;
