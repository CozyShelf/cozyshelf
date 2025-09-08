import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import NoClientsFound from "../../client/service/exceptions/NoClientsFound";
import { AddressDAO } from "../dao/typeORM/AddressDAO";
import CountryDAO from "../dao/typeORM/CountryDAO";
import Address from "../domain/Address";
import AddressModel from "../model/AddressModel";
import CountryModel from "../model/CountryModel";
import AddressNotFound from "./exceptions/AddressNotFound";
import NoAddressesFound from "./exceptions/NoAddressesFound";
import IUpdateAddressData from "../types/IUpdateAddressData";
import AddressType from "../domain/enums/AddressType";
import InvalidAddressesProvided from "../../client/domain/exceptions/InvalidAddressesProvided";
import { AddressCantBeRemoved } from "./exceptions/AddressCantBeRemoved";

export class AddressService {
	constructor(
		private readonly addressDAO: AddressDAO,
		private readonly clientDAO: ClientDAO,
		private readonly countryDAO: CountryDAO
	) {
		this.addressDAO = addressDAO;
		this.clientDAO = clientDAO;
		this.countryDAO = countryDAO;
	}

	async create(clientId: string, address: Address): Promise<Address> {
		const existingClient = await this.clientDAO.findById(clientId);
		if (!existingClient) {
			throw new NoClientsFound(clientId);
		}

		let newAddressModel = AddressModel.fromEntity(address);
		newAddressModel.client = existingClient;

		await this.getExistingCountryByAcronym(newAddressModel.country);
		newAddressModel = await this.addressDAO.save(newAddressModel);

		return newAddressModel.toEntity();
	}

	async getById(id: string): Promise<Address> {
		const addressModel = await this.addressDAO.findById(id);
		if (!addressModel) {
			throw new AddressNotFound(id);
		}
		return addressModel.toEntity();
	}

	async getAll(): Promise<Address[]> {
		const addressModels = await this.addressDAO.findAll();
		if (!addressModels || addressModels.length === 0) {
			throw new NoAddressesFound();
		}
		return addressModels.map((addressModel) => addressModel.toEntity());
	}

	async getByClientId(clientId: string): Promise<Address[]> {
		const existingClient = await this.clientDAO.findById(clientId);
		if (!existingClient) {
			throw new NoClientsFound(clientId);
		}

		const addressModels = await this.addressDAO.findByClientId(clientId);
		if (!addressModels || addressModels.length === 0) {
			return [];
		}
		return addressModels.map((addressModel) => addressModel.toEntity());
	}

	async update(id: string, updateData: IUpdateAddressData): Promise<Address> {
		const existingAddress = await this.addressDAO.findById(id);
		if (!existingAddress) {
			throw new AddressNotFound(id);
		}

		const updatedAddressEntity = existingAddress.toEntity();
		updatedAddressEntity.updateData(updateData);

		existingAddress.updateFromEntity(updatedAddressEntity);
		this.getExistingCountryByAcronym(existingAddress.country);

		const updatedAddressModel = await this.addressDAO.save(existingAddress);
		return updatedAddressModel.toEntity();
	}

	async delete(id: string): Promise<void> {
		const existingAddress = await this.addressDAO.findById(id);
		
		if (!existingAddress) {
			throw new AddressNotFound(id);
		}

		const clientAddresses = await this.addressDAO.findByClientId(existingAddress.client.id);

		if (clientAddresses.length <= 1) {
			throw new AddressCantBeRemoved();
		}

		const hasDeliveryAddress = clientAddresses.some(
			addr => addr.id !== id && 
			(addr.type === AddressType.DELIVERY || addr.type === AddressType.DELIVERY_AND_BILLING));
		const hasBillingAddress = clientAddresses.some(
			addr => addr.id !== id && 
			(addr.type === AddressType.BILLING || addr.type === AddressType.DELIVERY_AND_BILLING));

		if (!hasDeliveryAddress) {
			throw new InvalidAddressesProvided(AddressType.DELIVERY);
		}
	
		if (!hasBillingAddress) {
			throw new InvalidAddressesProvided(AddressType.BILLING);
		}
	
		await this.addressDAO.delete(id);
	}

	async getExistingCountryByAcronym(countryModel: CountryModel): Promise<void> {
		const country = await this.countryDAO.findByAcronym(countryModel.acronym);
		if (country) {
			countryModel = country;
		}
	}
}
