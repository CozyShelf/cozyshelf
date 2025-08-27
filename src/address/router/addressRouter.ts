import { Request, Response, Router } from "express";
import ConfigDynamicPaths from "../../generic/helpers/ConfigDynamicPaths";
import path from "path";

const addressRouter = Router();
addressRouter.use(
	ConfigDynamicPaths.configViewsPath(path.join(__dirname, "../views"))
);

//const addressController: AddressController = new AddressControllerFactory().make();

addressRouter.post("/", async (req: Request, res: Response) => {
	//await addressController.create(req, res);
});

addressRouter.get("/", (req: Request, res: Response) => {
	res.render("addressTable", {
		title: "Meus Endereços",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "address",
		isAdmin: false
	});
});

addressRouter.get("/new", (req: Request, res: Response) => {
	res.render("addressDetails", {
		title: "Novo Endereço",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "address",
		isAdmin: false,
	});
});

addressRouter.get("/:id", (req: Request, res: Response) => {
	res.render("addressDetails", {
		title: "Editar Endereço",
		currentHeaderTab: "profile",
		layout: "detailsLayout",
		currentUrl: "address",
		isAdmin: false,
	});
});

addressRouter.put("/:id", async (req: Request, res: Response) => {
	//await addressController.update(req, res);
});

addressRouter.delete("/:id", async (req: Request, res: Response) => {
	//await addressController.delete(req, res);
});

export default addressRouter;
