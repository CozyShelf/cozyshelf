import { Router, Request, Response } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const couponsRouter = Router();
couponsRouter.use(
    ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

couponsRouter.get("/", (req: Request, res: Response) => {
    res.render("couponsTable", {
        title: "Meus Cupons",
        layout: "detailsLayout",
        currentUrl: "coupons",
    });
});

export default couponsRouter;