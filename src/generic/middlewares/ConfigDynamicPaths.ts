import { NextFunction, Request, Response } from "express";
import path from "path";

export default class ConfigDynamicPaths {
	public static configViewsPath(viewsPath: string) {
		return (req: Request, _: Response, next: NextFunction) => {
			req.app.set("views", path.join(__dirname, viewsPath));
			next();
		};
	}

	public static configLayoutPath(layoutPath: string) {
		return (req: Request, _: Response, next: NextFunction) => {
				req.app.set("layout", path.join(__dirname, layoutPath));
				next();
			}
	}
}
