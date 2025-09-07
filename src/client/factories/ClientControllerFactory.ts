import ClientController from "../controller/ClientController";
import ClientDAO from "../dao/typeORM/ClientDAO";
import IFactory from "../../generic/factories/Factory";
import { ClientService } from "../service/ClientService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import CardFlagDAO from "../../card/dao/typeORM/CardFlagDAO";
import PasswordService from "../../password/service/PasswordService";
import PasswordDAO from "../../password/dao/PasswordDAO";
import CountryDAO from "../../address/dao/typeORM/CountryDAO";

export class ClientControllerFactory implements IFactory<ClientController> {
	public make(): ClientController {
		const clientDAO = new ClientDAO(postgresDataSource);
		const cardFlagDAO = new CardFlagDAO(postgresDataSource);
		const passwordDAO = new PasswordDAO(postgresDataSource);
		const countryDAO = new CountryDAO(postgresDataSource);

		const service = new ClientService(clientDAO, cardFlagDAO, countryDAO);
		const passwordService = new PasswordService(passwordDAO, clientDAO);

		return new ClientController(service, passwordService);
	}
}
