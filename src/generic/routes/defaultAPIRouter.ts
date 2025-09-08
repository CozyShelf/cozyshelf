import { Router } from "express";
import clientAPIRouter from "../../client/router/clientAPIRouter";
import addressAPIRouter from "../../address/routes/addressAPIRouter";

const defaultAPIRouter = Router();

defaultAPIRouter.use("/clients", clientAPIRouter);
defaultAPIRouter.use("/addresses", addressAPIRouter);

export default defaultAPIRouter;
