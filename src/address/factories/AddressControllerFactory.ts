import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import AddressController from "../controller/AddressController";
import { AddressDAO } from "../dao/typeORM/AddressDAO";
import CountryDAO from "../dao/typeORM/CountryDAO";
import { AddressService } from "../service/AddressService";

export class AddressControllerFactory implements IFactory<AddressController> {
	public make(): AddressController {
		const dao = new AddressDAO(postgresDataSource);
		const clientDAO = new ClientDAO(postgresDataSource);
		const countryDAO = new CountryDAO(postgresDataSource);

		const service = new AddressService(dao, clientDAO, countryDAO);
		return new AddressController(service);
	}
}
