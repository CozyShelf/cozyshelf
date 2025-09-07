import ClientController from "../controller/ClientController";
import ClientDAO from "../dao/typeORM/ClientDAO";
import IFactory from "../../generic/factories/Factory";
import { ClientService } from "../service/ClientService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import CardFlagDAO from "../../card/dao/typeORM/CardFlagDAO";

export class ClientControllerFactory implements IFactory<ClientController> {
	public make(): ClientController {
		const clientDAO = new ClientDAO(postgresDataSource);
		const cardFlagDAO = new CardFlagDAO(postgresDataSource);

		const service = new ClientService(clientDAO, cardFlagDAO);

		return new ClientController(service);
	}
}
