import { NextFunction, Request, Response } from "express";
import path from "path";

export default class ConfigDynamicPaths {
	public static configViewsPath(moduleViewsPath: string) {
		return (req: Request, res: Response, next: NextFunction) => {
			const originalViews = req.app.get("views");

			const views = [moduleViewsPath, ...originalViews];
			req.app.set("views", views);

			res.on("finish", () => {
				req.app.set("views", originalViews);
			});
			next();
		};
	}

	public static configLayoutPath(layoutPath: string) {
		return (req: Request, _: Response, next: NextFunction) => {
			req.app.set("layout", path.join(layoutPath));
			next();
		};
	}
}
