import ICRUDController from "../../generic/controller/ICRUDController";
import {Request, Response} from "express";
import {AddressService} from "../service/AddressService";
import AddressModel from "../model/AddressModel";

export default class AddressController implements ICRUDController<AddressModel> {
	private readonly service: AddressService

	constructor(service: AddressService) {
		this.service = service;
	}

	public async create(req: Request, res:Response): Promise<AddressModel> {
		return await this.service.create(req);
	}
	public async getAll(req: Request, res: Response): Promise<AddressModel[] | null> {
		return this.service.getAll();
	}

	public async getById(req: Request, res: Response): Promise<AddressModel | null> {
		return this.service.getById(req.params.id);
	}

	public async update(req: Request, res: Response): Promise<AddressModel | null> {
		return this.service.update(req.params.id, req.body);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		return this.service.delete(req.params.id);
	}
}
