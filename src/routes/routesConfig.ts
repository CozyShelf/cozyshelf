import { Express, Request, Response } from "express";
import path from "path";

export default function routesConfig(server: Express) {
	server.get("/", (_: Request, res: Response) => {
		res.status(200).send("Welcome to the default route!");
	});

	server.get("/view-test", (_: Request, res: Response) => {
		res.render("view-test", {
			title: "View Test",
			message: "This is a test of the view rendering system.",
			imagePath: path.resolve(__dirname, "/assets/coffee.jpg")
		});
	});
}
