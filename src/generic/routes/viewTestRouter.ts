import { Request, Response, Router } from "express";
import configViewsPath from "../middlewares/configViewPath";

const viewTestRouter = Router();

viewTestRouter.use(configViewsPath("../views/pages/"))

viewTestRouter.get("/", (_: Request, res: Response) => {
	res.render("customer-registration", {
		title: "View Test",
		message: "This is a test of the view rendering system."
	});
});

export default viewTestRouter;
