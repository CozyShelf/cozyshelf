import { NextFunction, Request, Response } from "express";

export default class ConfigDynamicPaths {
	public static configViewsPath(moduleViewsPaths: string | string[]) {
		return (req: Request, res: Response, next: NextFunction) => {
			const originalViews = req.app.get("views");

			const pathsArray = Array.isArray(moduleViewsPaths)
				? moduleViewsPaths
				: [moduleViewsPaths];

			const views = [...pathsArray, ...originalViews];
			req.app.set("views", views);

			res.on("finish", () => {
				req.app.set("views", originalViews);
			});

			next();
		};
	}
}
