import express, { Express } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import defaultRouter from "../routes/defaultRouter";
import ConfigDynamicPaths from "./ConfigDynamicPaths";

export default function defaultMiddlewareConfig(app: Express) {
	app.use(express.json());

	app.use(express.static(path.join(__dirname, "../../../public")));
	app.use(expressLayouts);

	app.use(ConfigDynamicPaths.configLayoutPath(path.join(__dirname, "../views/layouts/defaultLayout.ejs")));
	app.set("view engine", "ejs");

	app.use("/", defaultRouter);
}
