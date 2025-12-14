import express, { Express } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";

export default function defaultMiddlewareConfig(app: Express) {
	app.use(express.json());

	app.use(express.static(path.join(__dirname, "../../../public")));
	app.use(expressLayouts);
}
