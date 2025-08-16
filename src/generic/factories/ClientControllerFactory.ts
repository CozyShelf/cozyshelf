import {postgresDataSource} from "../config/database/dataSources/postgresDataSource";
import ClientController from "../../client/controller/ClientController";
import {ClientDAOImpl} from "../../client/dao/typeORM/ClientDAOImpl";
import IFactory from "./Factory";
import {ClientService} from "../../client/service/ClientService";

export class ClientControllerFactory implements IFactory<ClientController> {
	public make(): ClientController {
		const dao = new ClientDAOImpl(postgresDataSource);
		const service = new ClientService(dao);
		return new ClientController(service);
	}
}
