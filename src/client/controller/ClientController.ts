import {Request, Response} from "express";
import {ClientService} from "../service/ClientService";
import ICRUDController from "../../generic/controller/ICRUDController";

export default class ClientController implements ICRUDController<ClientController> {
	private  readonly service: ClientService;

	public constructor(private service: ClientService) {
		this.service = service;
	}

	public create(req: Request, res: Response): Promise<ClientController> {
		// Implementation for getting all clients
		return Promise.resolve(this);
	}

	public getAll(req: Request, res: Response): Promise<ClientController[]> {
			// Implementation for getting all clients
			return Promise.resolve([]);
	}

	public getById(req: Request, res: Response): Promise<ClientController> {
			// Implementation for getting a client by ID
			return Promise.resolve(this);
	}

	public update(req: Request, res: Response): Promise<ClientController> {
			// Implementation for updating a client
			return Promise.resolve(this);
	}

	public delete(req: Request, res: Response): Promise<ClientController> {
		// Implementation for deleting a client
		return Promise.resolve(this);
	}
}
