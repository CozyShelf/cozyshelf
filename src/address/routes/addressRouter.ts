import { Request, Response, Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import AddressController from "../controller/AddressController";
import { AddressControllerFactory } from "../factories/AddressControllerFactory";

const addressRouter = Router();
addressRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const addressController: AddressController =
	new AddressControllerFactory().make();

addressRouter.get("/client/:id", (req: Request, res: Response) => {
	addressController.renderAddressesTable(req, res);
});

addressRouter.get("/register", (req: Request, res: Response) => {
	addressController.renderCreateAddress(req, res);
});

addressRouter.get("/:id", (req: Request, res: Response) => {
	addressController.renderAddressDetails(req, res);
});

export default addressRouter;
