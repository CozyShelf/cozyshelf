import { Request, Response, Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const chatbotRouter = Router();
chatbotRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

chatbotRouter.get("/", (_: Request, res: Response) => {
	res.render("mingauChatbot", {
		title: "Converse com o Mingau",
		currentHeaderTab: ""
	});
});

export default chatbotRouter;
