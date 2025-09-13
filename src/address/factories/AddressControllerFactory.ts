import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import AddressController from "../controller/AddressController";
import { AddressDAO } from "../dao/typeORM/AddressDAO";
import CountryDAO from "../dao/typeORM/CountryDAO";
import { AddressService } from "../service/AddressService";

export class AddressControllerFactory implements IFactory<AddressController> {
	private addressDAO: AddressDAO;
	private countryDAO: CountryDAO;

	public constructor() {
		this.addressDAO = new AddressDAO(postgresDataSource);
		this.countryDAO = new CountryDAO(postgresDataSource);
	}

	public make(): AddressController {
		const clientDAO = new ClientDAO(postgresDataSource);
		const service = this.makeAddressService(clientDAO);
		return new AddressController(service);
	}

	public makeAddressService(clientDAO: ClientDAO) {
		return new AddressService(this.addressDAO, clientDAO, this.countryDAO);
	}
}
