import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import AddressType from "../domain/enums/AddressType";
import CountryModel from "./CountryModel";
import GenericModel from "../../generic/model/GenericModel";
import ClientModel from "../../client/model/ClientModel";
import Address from "../domain/Address";

@Entity()
export default class AddressModel extends GenericModel {
	@Column({ type: "varchar" })
	shortPhrase!: string;

	@Column({ type: "varchar" })
	zipCode!: string;

	@Column({ type: "varchar" })
	streetType!: string;

	@Column({ type: "varchar" })
	streetName!: string;

	@Column({ type: "varchar" })
	number!: string;

	@Column({ type: "varchar" })
	residenceType!: string;

	@Column({ type: "varchar" })
	neighborhood!: string;

	@Column({ type: "varchar" })
	city!: string;

	@Column({ type: "varchar" })
	state!: string;

	@ManyToOne(() => CountryModel, { cascade: true, eager: true })
	@JoinColumn()
	country!: CountryModel;

	@Column({ type: "enum", enum: AddressType })
	type!: AddressType;

	@Column({ type: "varchar" })
	observation: string;

	@ManyToOne(() => ClientModel, (client: ClientModel) => client.addresses)
	@JoinColumn()
	client!: ClientModel;

	constructor(
		zipCode: string,
		number: string,
		residenceType: string,
		streetName: string,
		streetType: string,
		neighborhood: string,
		shortPhrase: string,
		observation: string,
		city: string,
		state: string,
		country: CountryModel,
		type: AddressType,
		isActive: boolean
	) {
		super();
		this.zipCode = zipCode;
		this.number = number;
		this.residenceType = residenceType;
		this.streetName = streetName;
		this.streetType = streetType;
		this.neighborhood = neighborhood;
		this.shortPhrase = shortPhrase;
		this.observation = observation;
		this.city = city;
		this.state = state;
		this.country = country;
		this.type = type;
		this.isActive = isActive;
	}

	public toEntity(): Address {
		const country = this.country.toEntity();

		const address = new Address(
			this.zipCode,
			this.number,
			this.residenceType,
			this.streetName,
			this.streetType,
			this.neighborhood,
			this.shortPhrase,
			this.observation,
			this.city,
			this.state,
			country,
			this.type
		);
		address.id = this.id;
		address.isActive = this.isActive;

		return address;
	}

	public static fromEntity(address: Address): AddressModel {
		return new AddressModel(
			address.zipCode,
			address.number,
			address.residenceType,
			address.streetName,
			address.streetType,
			address.neighborhood,
			address.shortPhrase,
			address.observation,
			address.city,
			address.state,
			CountryModel.fromEntity(address.country),
			address.type,
			address.isActive
		);
	}

	public updateFromEntity(updatedAddress: Address) {
		if (updatedAddress.shortPhrase != this.shortPhrase) {
			this.shortPhrase = updatedAddress.shortPhrase;
		}
		if (updatedAddress.zipCode != this.zipCode) {
			this.zipCode = updatedAddress.zipCode;
		}
		if (updatedAddress.streetType != this.streetType) {
			this.streetType = updatedAddress.streetType;
		}
		if (updatedAddress.streetName != this.streetName) {
			this.streetName = updatedAddress.streetName;
		}
		if (updatedAddress.number != this.number) {
			this.number = updatedAddress.number;
		}
		if (updatedAddress.residenceType != this.residenceType) {
			this.residenceType = updatedAddress.residenceType;
		}
		if (updatedAddress.neighborhood != this.neighborhood) {
			this.neighborhood = updatedAddress.neighborhood;
		}
		if (updatedAddress.city != this.city) {
			this.city = updatedAddress.city;
		}
		if (updatedAddress.state != this.state) {
			this.state = updatedAddress.state;
		}
		if (updatedAddress.observation != this.observation) {
			this.observation = updatedAddress.observation;
		}
		if (updatedAddress.isActive != this.isActive) {
			this.isActive = updatedAddress.isActive;
		}
		this.country.updateFromEntity(updatedAddress.country);
	}
}
