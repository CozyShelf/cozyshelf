import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import AddressController from "../controller/AddressController";
import { AddressDAO } from "../dao/typeORM/AddressDAO";
import { AddressService } from "../service/AddressService";

export class AddressControllerFactory implements IFactory<AddressController> {
	public make(): AddressController {
		const dao = new AddressDAO(postgresDataSource);
		const service = new AddressService(dao);
		return new AddressController(service);
	}
}
