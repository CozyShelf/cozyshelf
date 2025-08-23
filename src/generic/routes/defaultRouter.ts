import { Router } from "express";
import clientRouter from "../../client/router/ClientRouter";
import addressRouter from "../../address/router/AddressRouter";
import cardRouter from "../../card/router/CardRouter";
import orderRouter from "../../order/router/OrderRouter";

const defaultRouter = Router();

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);
defaultRouter.use("/orders", orderRouter);

export default defaultRouter;
