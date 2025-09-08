import { Request, Response, Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { CardControllerFactory } from "../factories/CardControllerFactory";

const cardRouter = Router();
cardRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const cardController = new CardControllerFactory().make();

cardRouter.get("/client/:id", async (req: Request, res: Response) => {
	await cardController.renderCardsTable(req, res);
});

cardRouter.get("/new", (req: Request, res: Response) => {
	cardController.renderCreateCardForm(req, res);
});

cardRouter.get("/:id", async (req: Request, res: Response) => {
	await cardController.renderCardDetails(req, res);
});

export default cardRouter;
