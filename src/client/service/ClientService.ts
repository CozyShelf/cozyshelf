import ClientModel from "../model/ClientModel";
import IClientDAO from "../dao/typeORM/IClientDAO";

export class ClientService {

	private readonly clientDAO: IClientDAO;

	constructor(clientDAO: IClientDAO) {
		this.clientDAO = clientDAO;
	}

	public async create(client: ClientModel): Promise<ClientModel> {
		return this.clientDAO.save(client);
	}

	public async getAll(): Promise<ClientModel[] | null> {
		return this.clientDAO.getAll();
	}

	public async getById(id: string): Promise<ClientModel | null> {
		return this.clientDAO.getById(id);
	}

	public async update(id: string, newClient: ClientModel): Promise<ClientModel> {
		const existingClient = await this.clientDAO.getById(id);
		if (!existingClient) {
			throw new Error(`Client with id ${id} not found`);
		}

		existingClient.name = newClient.name;
		existingClient.birthDate = newClient.birthDate;
		existingClient.cpf = newClient.cpf;
		existingClient.email = newClient.email;
		existingClient.password = newClient.password;
		existingClient.address = newClient.address;
		existingClient.ranking = newClient.ranking;
		existingClient.telephone = newClient.telephone;
		existingClient.gender = newClient.gender;

		return this.clientDAO.save(existingClient);
	}

	public async delete(id: string): Promise<void> {
		const existingClient = await this.clientDAO.getById(id);
		if (!existingClient) {
			throw new Error(`Client with id ${id} not found`);
		}

		return this.clientDAO.delete(id);
	}
}
