import express, { Express } from "express";
import path from "path";

export default function defaultMiddlewareConfig(app: Express) {
	app.use(express.json());
	configStaticFiles(app);
	configViewEngine(app);
}

function configStaticFiles(app: Express) {
	app.use(express.static(path.join(__dirname, "../../public")));
}

function configViewEngine(app: Express) {
	app.set("views", path.join(__dirname, "../views"));
	app.set("view engine", "ejs");
}
