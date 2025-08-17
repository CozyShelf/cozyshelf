import ClientController from "../controller/ClientController";
import { ClientDAO } from "../dao/typeORM/ClientDAO";
import IFactory from "../../generic/factories/Factory";
import { ClientService } from "../service/ClientService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";

export class ClientControllerFactory implements IFactory<ClientController> {
	public make(): ClientController {
		const dao = new ClientDAO(postgresDataSource);
		const service = new ClientService(dao);
		return new ClientController(service);
	}
}
