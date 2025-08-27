import { Router, Request, Response } from "express";
import clientRouter from "../../client/router/clientRouter";
import addressRouter from "../../address/router/addressRouter";
import cardRouter from "../../card/router/cardRouter";
import orderRouter from "../../order/router/orderRouter";
import couponsRouter from "../../coupons/router/couponsRouter";
import { BookControllerFactory } from "../../books/factories/BookControllerFactory";
import bookRouter from "../../books/routes/bookRouter";
import adminRouter from "../../admin/routes/adminRouter";
import cartRouter from "../../cart/routes/cartRouter";

const defaultRouter = Router();
const bookController = new BookControllerFactory().make();

defaultRouter.get("/", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	res.render("homePage", {
		title: "Seja bem vindo !",
		currentHeaderTab: "home",
		books,
	});
});

defaultRouter.use("/clients", clientRouter);
defaultRouter.use("/addresses", addressRouter);
defaultRouter.use("/cards", cardRouter);
defaultRouter.use("/orders", orderRouter);
defaultRouter.use("/coupons", couponsRouter);
defaultRouter.use("/shopping-cart", cartRouter);
defaultRouter.use("/books", bookRouter);
defaultRouter.use("/admin", adminRouter);

export default defaultRouter;
