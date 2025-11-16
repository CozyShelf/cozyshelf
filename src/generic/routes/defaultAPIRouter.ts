import { Router } from "express";
import clientAPIRouter from "../../client/router/clientAPIRouter";
import addressAPIRouter from "../../address/routes/addressAPIRouter";
import cardAPIRouter from "../../card/routes/cardAPIRouter";
import cartAPIRouter from "../../cart/routes/cartAPIRouter";
import bookAPIRouter from "../../books/routes/bookAPIRouter";
import orderAPIRouter from "../../order/router/orderAPIRouter";
import chatbotRouter from "../../ia/routes/chatbotRouter";

const defaultAPIRouter = Router();

defaultAPIRouter.use("/clients", clientAPIRouter);
defaultAPIRouter.use("/addresses", addressAPIRouter);
defaultAPIRouter.use("/cards", cardAPIRouter);
defaultAPIRouter.use("/carts", cartAPIRouter);
defaultAPIRouter.use("/books", bookAPIRouter);
defaultAPIRouter.use("/orders", orderAPIRouter);
defaultAPIRouter.use("/chatbot", chatbotRouter);

export default defaultAPIRouter;
