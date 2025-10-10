import { Router } from "express";
import { OrderControllerFactory } from "../factory/OrderControllerFactory";

const orderAPIRouter = Router();
const orderController = new OrderControllerFactory().make();

orderAPIRouter.post("/", async (req, res) => {
    await orderController.create(req, res);
});

export default orderAPIRouter;