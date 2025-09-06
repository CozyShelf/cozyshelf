import ClientDAO from "../dao/typeORM/ClientDAO";
import Client from "../domain/Client";
import ClientModel from "../model/ClientModel";

export class ClientService {
	private readonly clientDAO: ClientDAO;

	constructor(clientDAO: ClientDAO) {
		this.clientDAO = clientDAO;
	}

	public async create(client: Client): Promise<Client> {
		const model = ClientModel.fromEntity(client);
		const savedClient = await this.clientDAO.save(model);
		return savedClient.toEntity();
	}

	public async getAll(): Promise<Client[] | null> {
		throw new Error("Not implemented method");
	}

	public async getById(_: string): Promise<Client | null> {
		throw new Error("Not implemented method");
	}

	public async update(_: string, __: Client): Promise<Client> {
		throw new Error("Not implemented method");
	}

	public async delete(_: string): Promise<void> {
		throw new Error("Not implemented method");
	}
}
