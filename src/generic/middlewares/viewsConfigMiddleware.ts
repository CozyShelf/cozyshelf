import { Express } from "express";
import ConfigDynamicPaths from "../helpers/ConfigDynamicPaths";
import path from "path";

export default function viewsConfigMiddleware(app: Express) {
	app.use(
		ConfigDynamicPaths.configLayoutPath(
			path.join(__dirname, "../views/layouts/defaultLayout.ejs")
		)
	);

	app.use(
		ConfigDynamicPaths.configViewsPath(
			path.join(__dirname, "../views/components")
		)
	);

	app.set("view engine", "ejs");
}
