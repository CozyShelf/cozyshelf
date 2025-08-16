import { Router } from "express";
import clientRouter from "../../client/router/ClientRouter";

const defaultRouter = Router();

defaultRouter.use("/clients", clientRouter);

export default defaultRouter;
