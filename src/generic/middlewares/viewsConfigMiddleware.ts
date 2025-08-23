import { Express } from "express";
import path from "path";

export default function viewsConfigMiddleware(app: Express) {
	app.set("views", [
		path.join(__dirname, "../views"),
		path.join(__dirname, "../views/components"),
		path.join(__dirname, "../views/layouts"),
		path.join(__dirname, "../views/pages"),
	]);

	app.set(
		"layout",
		path.join(__dirname, "../views/layouts/defaultLayout.ejs")
	);

	app.set("view engine", "ejs");
}
