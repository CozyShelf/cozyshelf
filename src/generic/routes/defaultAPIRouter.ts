import { Router } from "express";
import clientAPIRouter from "../../client/router/clientAPIRouter";

const defaultAPIRouter = Router();

defaultAPIRouter.use("/clients", clientAPIRouter);

export default defaultAPIRouter;
