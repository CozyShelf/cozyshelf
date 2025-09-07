import CardFlagDAO from "../../card/dao/typeORM/CardFlagDAO";
import ClientDAO from "../dao/typeORM/ClientDAO";
import Client from "../domain/Client";
import ClientModel from "../model/ClientModel";
import NoClientsFound from "./exceptions/NoClientsFound";

export class ClientService {
	constructor(
		private readonly clientDAO: ClientDAO,
		private readonly cardFlagDAO: CardFlagDAO
	) {}

	public async create(client: Client): Promise<Client> {
		const clientModel = ClientModel.fromEntity(client);

		for (const cardModel of clientModel.cards) {
			const flagModel = await this.cardFlagDAO.getFlagByDescription(
				cardModel.flagDescription
			);

			if (flagModel) {
				cardModel.cardFlag = flagModel;
			}
		}

		const savedClient = await this.clientDAO.save(clientModel);
		return savedClient.toEntity();
	}

	public async getAll(): Promise<Client[]> {
		const clientsFound = await this.clientDAO.findAll();
		if (!clientsFound) {
			throw new NoClientsFound();
		}
		return clientsFound.map((clientModel) => clientModel.toEntity());
	}

	public async getById(id: string): Promise<Client> {
		const clientModel = await this.clientDAO.findById(id);

		if (!clientModel) {
			throw new NoClientsFound(id);
		}

		return clientModel.toEntity();
	}

	public async update(id: string, client: Client): Promise<Client> {
		const existingClient = await this.clientDAO.findById(id);
		if (!existingClient) {
			throw new NoClientsFound(id);
		}

		client.id = id;
		const clientModel = ClientModel.fromEntity(client);

		const updatedClient = await this.clientDAO.save(clientModel);
		return updatedClient.toEntity();
	}

	public async delete(id: string): Promise<void> {
		const existingClient = await this.clientDAO.findById(id);
		if (!existingClient) {
			throw new NoClientsFound(id);
		}

		await this.clientDAO.delete(id);
	}
}
