import { Request, Response, Router } from "express";
import viewTestRouter from "./viewTestRouter";

const defaultRouter = Router();

defaultRouter.get("/", (_: Request, res: Response) => {
	res.status(200).send("Welcome to the default route!");
});

defaultRouter.use("/view-test", viewTestRouter);

export default defaultRouter;
