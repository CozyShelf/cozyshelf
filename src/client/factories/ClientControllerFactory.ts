import ClientController from "../controller/ClientController";
import ClientDAO from "../dao/typeORM/ClientDAO";
import IFactory from "../../generic/factories/Factory";
import { ClientService } from "../service/ClientService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import PasswordService from "../../password/service/PasswordService";
import PasswordDAO from "../../password/dao/PasswordDAO";
import { CardControllerFactory } from "../../card/factories/CardControllerFactory";
import { AddressControllerFactory } from "../../address/factories/AddressControllerFactory";

export class ClientControllerFactory implements IFactory<ClientController> {
	private cardFactory: CardControllerFactory;
	private addressFactory: AddressControllerFactory;

	public constructor() {
		this.cardFactory = new CardControllerFactory();
		this.addressFactory = new AddressControllerFactory();
	}

	public make(): ClientController {
		const clientDAO = new ClientDAO(postgresDataSource);
		const cardService = this.cardFactory.makeCardService(clientDAO);
		const addressService = this.addressFactory.makeAddressService(clientDAO);

		const passwordDAO = new PasswordDAO(postgresDataSource);

		const service = new ClientService(clientDAO, cardService, addressService);
		const passwordService = new PasswordService(passwordDAO, clientDAO);

		return new ClientController(service, passwordService);
	}
}
