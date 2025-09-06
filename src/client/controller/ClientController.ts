import { Request, Response } from "express";
import { ClientService } from "../service/ClientService";
import ICRUDController from "../../generic/controller/ICRUDController";
import Client from "../domain/Client";
import INewClientInputData from "../types/INewClientRequestData";

export default class ClientController implements ICRUDController<Client> {
	public constructor(private readonly service: ClientService) {}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			const client = Client.fromRequestData(req.body as INewClientInputData);
			const createdClient = await this.service.create(client);

			res.status(200).json({
				message: `Client ${createdClient.name} created successfully`,
				clientId: createdClient.id
			});
		} catch (e) {
			throw e;
			// res.status(400).json({
			// 	message: (e as Error).message
			// });
		}
	}

	public getAll(req: Request, res: Response): Promise<Client[]> {
		// Implementation for getting all clients
		return Promise.resolve([]);
	}

	public getById(req: Request, res: Response): Promise<Client> {
		// Implementation for getting a client by ID
		throw new Error("Not implemented method");
	}

	public update(req: Request, res: Response): Promise<Client> {
		// Implementation for updating a client
		throw new Error("Not implemented method");
	}

	public delete(req: Request, res: Response): Promise<void> {
		// Implementation for deleting a client
		throw new Error("Not implemented method");
	}
}
