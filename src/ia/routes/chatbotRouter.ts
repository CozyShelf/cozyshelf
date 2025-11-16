import { Request, Response, Router } from "express";
import ChatbotControllerFactory from "../factories/ChatbotControllerFactory";

const chatbotRouter = Router();
const controller = new ChatbotControllerFactory().make();

chatbotRouter.post("/", (req: Request, res: Response) => {
	return controller.handleChatRequest(req, res);
});

export default chatbotRouter;
