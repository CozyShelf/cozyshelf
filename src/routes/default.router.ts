import { Request, Response, Router } from "express";

const defaultRouter = Router();

defaultRouter.get("/", (_: Request, res: Response) => {
	res.status(200).send("Welcome to the default route!");
});

defaultRouter.get("/view-test", (_: Request, res: Response) => {
	res.render("view-test", {
		title: "View Test",
		message: "This is a test of the view rendering system.",
		imagePath: "/assets/coffee.jpg",
	});
});

export default defaultRouter;
