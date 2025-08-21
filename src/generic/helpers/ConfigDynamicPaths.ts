import { NextFunction, Request, Response } from "express";

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
}
