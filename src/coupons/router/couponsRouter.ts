import { Router, Request, Response } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";
import { CouponControllerFactory } from "../factories/CouponControllerFactory";

const couponsRouter = Router();
couponsRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

const couponsController = new CouponControllerFactory().make();

couponsRouter.get("/", async (req: Request, res: Response) => {
	await couponsController.renderCouponsTable(req, res);
});

export default couponsRouter;
