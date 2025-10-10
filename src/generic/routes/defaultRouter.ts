import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/clientRouter";
import addressRouter from "../../address/routes/addressRouter";
import cardRouter from "../../card/routes/cardRouter";
import orderRouter from "../../order/router/orderRouter";
import couponsRouter from "../../coupons/router/couponsRouter";
import bookRouter from "../../books/routes/bookRouter";
import adminRouter from "../../admin/routes/adminRouter";
import cartRouter from "../../cart/routes/cartRouter";
import chatbotRouter from "../../ia/routes/chatbotRouter";
import defaultAPIRouter from "./defaultAPIRouter";
import HomePageControllerFactory from "../factories/HomePageControllerFactory";

const defaultRouter = Router();
const homePageController = new HomePageControllerFactory().make();

defaultRouter.get("/", async (req: Request, res: Response) =>
	homePageController.renderHomePage(req, res)
);

defaultRouter.use("/api", defaultAPIRouter);

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);
defaultRouter.use("/orders", orderRouter);
defaultRouter.use("/coupons", couponsRouter);
defaultRouter.use("/shopping-cart", cartRouter);
defaultRouter.use("/books", bookRouter);
defaultRouter.use("/admin", adminRouter);
defaultRouter.use("/chatbot", chatbotRouter);

export default defaultRouter;
