import { Request, Response, Router } from "express";
import CartControllerFactory from "../factories/CartControllerFactory";

const cartAPIRouter = Router();
const cartController = new CartControllerFactory().make();

cartAPIRouter.post("/", async (req: Request, res: Response) =>
	cartController.addItemToCart(req, res)
);

cartAPIRouter.post("/remove", async (req: Request, res: Response) =>
	cartController.removeQuantityFromCart(req, res)
);

cartAPIRouter.get("/:clientID", (req: Request, res: Response) =>
	cartController.getAllCartItemsByClientId(req, res)
);

cartAPIRouter.delete("/:itemId", (req: Request, res: Response) =>
	cartController.removeCartItem(req, res)
);

export default cartAPIRouter;
