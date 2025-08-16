import { Request, Response, NextFunction } from "express";
import path from "path";

export default function configViewsPath (
	moduleViewsPath: string
) {
	return (req: Request, _: Response, next: NextFunction) => {
		req.app.set("views", path.join(__dirname, moduleViewsPath));
		next();
	}
}
