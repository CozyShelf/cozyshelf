import { Router } from "express";
import clientAPIRouter from "../../client/router/clientAPIRouter";
import addressAPIRouter from "../../address/routes/addressAPIRouter";
import cardAPIRouter from "../../card/routes/cardAPIRouter";

const defaultAPIRouter = Router();

defaultAPIRouter.use("/clients", clientAPIRouter);
defaultAPIRouter.use("/addresses", addressAPIRouter);
defaultAPIRouter.use("/cards", cardAPIRouter)

export default defaultAPIRouter;
