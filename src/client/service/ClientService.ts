import { AddressService } from "../../address/service/AddressService";
import { CardService } from "../../card/service/CardService";
import ClientDAO from "../dao/typeORM/ClientDAO";
import Client from "../domain/Client";
import ClientModel from "../model/ClientModel";
import IClientFilters from "../types/IClientFilters";
import IUpdateClientData from "../types/IUpdateClientData";
import ClientAlreadyExists from "./exceptions/ClientAlreadyExists";
import NoClientsFound from "./exceptions/NoClientsFound";

export class ClientService {
	constructor(
		private readonly clientDAO: ClientDAO,
		private readonly cardService: CardService,
		private readonly addressService: AddressService
	) {}

	public async create(client: Client): Promise<Client> {
		const clientAlreadyExists = await this.verifyIfClientAlreadyExists(client);
		if (clientAlreadyExists) {
			throw new ClientAlreadyExists();
		}

		const clientModel = ClientModel.fromEntity(client);

		for (const cardModel of clientModel.cards) {
			cardModel.cardFlag = await this.cardService.getExistentCardFlag(
				cardModel.flagDescription
			);
		}

		for (const address of clientModel.addresses) {
			await this.addressService.getExistingCountryByAcronym(address.country);
		}

		const savedClient = await this.clientDAO.save(clientModel);
		return savedClient.toEntity();
	}

	private async verifyIfClientAlreadyExists(client: Client) {
		const alreadyExistsWithEmail = await this.clientDAO.findByEmail(
			client.email
		);
		const alreadyExistsWithCPF = await this.clientDAO.findByCPF(client.cpf);

		return !!alreadyExistsWithEmail || !!alreadyExistsWithCPF;
	}

	public async getAll(filters?: IClientFilters): Promise<Client[]> {
		const clientsFound = await this.clientDAO.findAll(filters);
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

	public async update(
		id: string,
		updatedData: IUpdateClientData
	): Promise<Client> {
		const existingClientModel = await this.clientDAO.findById(id);
		if (!existingClientModel) {
			throw new NoClientsFound(id);
		}

		const updatedEntity = existingClientModel.toEntity();
		updatedEntity.updateData(updatedData);

		existingClientModel.updateFromEntity(updatedEntity);
		const updatedModel = await this.clientDAO.save(existingClientModel);

		return updatedModel.toEntity();
	}

	public async delete(id: string): Promise<void> {
		const existingClient = await this.clientDAO.findById(id);
		if (!existingClient) {
			throw new NoClientsFound(id);
		}

		const updatedEntity = existingClient.toEntity();
		updatedEntity.inactivate();

		existingClient.updateFromEntity(updatedEntity, true);

		await this.clientDAO.save(existingClient);
	}
}
