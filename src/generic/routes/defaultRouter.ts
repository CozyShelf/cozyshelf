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
import chatbotRouter from "../../ia/routes/chatbotRouter";

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

defaultRouter.get("/shopping-cart", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	res.render("shoppingCart", {
		title: "Carrinho de Compras",
		currentHeaderTab: "cart",
		books: books,
		coupons: [],
	});
});

defaultRouter.get("/admin/dashboard", async (req: Request, res: Response) => {
	const books = await bookController.getAll(req, res);

	const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

	const salesHistory = (books ?? []).map((book: any) => {
		const sales = labels.map(() => Math.floor(Math.random() * 50) + 10); // vendas aleatórias
		return {
			label: book.name,
			data: sales,
			fill: false,
			borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // cor aleatória
			tension: 0.3,
		};
	});

	res.render("dashboard", {
		title: "Dashboard - Grafico de linha de vendas",
		currentHeaderTab: "profile",
		layout: "defaultLayoutAdmin",
		currentUrl: "dashboard",
		books,
		labels,
		salesHistory
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
defaultRouter.use("/chatbot", chatbotRouter);

export default defaultRouter;
