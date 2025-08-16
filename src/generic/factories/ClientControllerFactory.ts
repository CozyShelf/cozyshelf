import ClientController from "../../client/controller/ClientController";
import {ClientDAO} from "../../client/dao/typeORM/ClientDAO";
import IFactory from "./Factory";
import {ClientService} from "../../client/service/ClientService";
import postgresDataSource from "../config/database/datasources/postgresDataSource";

export class ClientControllerFactory implements IFactory<ClientController> {
	public make(): ClientController {
		const dao = new ClientDAO(postgresDataSource);
		const service = new ClientService(dao);
		return new ClientController(service);
	}
}
