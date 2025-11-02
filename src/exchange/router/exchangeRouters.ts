import { Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { ExchangeControllerFactory } from "../factories/ExchangeControllerFactory";

const exchangeRouter = Router();
exchangeRouter.use(
    ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const ExchangeController = new ExchangeControllerFactory().make();

exchangeRouter.post("/", async (req, res) => {
    await ExchangeController.create(req, res);
});

exchangeRouter.post("/:id/confirm", async (req, res) => {
    await ExchangeController.confirmExchange(req, res);
});

export default exchangeRouter;