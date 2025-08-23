import Address from "../domain/Address";
import {AddressDAO} from "../dao/typeORM/AddressDAO";
import AddressModel from "../model/AddressModel";
import CountryModel from "../model/CountryModel";

export class AddressService {

	private readonly addressDAO: AddressDAO;

	constructor(addressDAO: AddressDAO) {
		this.addressDAO = addressDAO;
	}

	async create(address: any): Promise<AddressModel> {
		const newAddress = new Address(
			address.zipCode, address.number,
			address.residenceType, address.streetName,
			address.streetType, address.neighborhood,
			address.shortPhrase, address.observation,
			address.city, address.state,
			address.country, address.type
		);

		const addressModel = new AddressModel(
			newAddress.zipCode, newAddress.number,
			newAddress.residenceType, newAddress.streetName,
			newAddress.streetType, newAddress.neighborhood,
			newAddress.shortPhrase, newAddress.observation,
			newAddress.city, newAddress.state,
			new CountryModel(newAddress.country.name, newAddress.country.acronym),
			newAddress.type);

		return this.addressDAO.save(addressModel);
	}

	async getById(id: string): Promise<AddressModel | null> {
		return this.addressDAO.findById(id);
	}

	async getAll(): Promise<AddressModel[]| null> {
		return this.addressDAO.findAll()
	}

	async update(id: string, address: any): Promise<AddressModel | null> {
		const existingAddress = await this.addressDAO.findById(id);
		if (!existingAddress) {
			return null;
		}

		existingAddress.zipCode = address.zipCode;
		existingAddress.number = address.number;
		existingAddress.residenceType = address.residenceType;
		existingAddress.streetName = address.streetName;
		existingAddress.streetType = address.streetType;
		existingAddress.neighborhood = address.neighborhood;
		existingAddress.shortPhrase = address.shortPhrase;
		existingAddress.observation = address.observation;
		existingAddress.city = address.city;
		existingAddress.state = address.state;
		existingAddress.country = address.country;
		existingAddress.type = address.type;

		return this.addressDAO.save(existingAddress);
	}

	async delete(id: string): Promise<void> {
		const existingAddress = await this.addressDAO.findById(id);
		if (existingAddress) {
			await this.addressDAO.delete(id);
		}
	}
}
