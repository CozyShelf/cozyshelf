import { Request, Response } from "express";

export default interface ICRUDController<T> {
	create(req: Request, res: Response): Promise<void>;
	getAll(req: Request, res: Response): Promise<T[] | null>;
	getById(req: Request, res: Response): Promise<T | null>;
	update(req: Request, res: Response): Promise<T | null>;
	delete(req: Request, res: Response): Promise<void>;
}
