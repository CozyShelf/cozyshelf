import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import AddressType from "../domain/enums/AddressType";
import CountryModel from "./CountryModel";
import GenericModel from "../../generic/model/GenericModel";
import Address from "../domain/Address";
import ClientModel from "../../client/model/ClientModel";

@Entity()
export default class AddressModel extends GenericModel {
	@Column({type: "varchar"})
	_shortPhrase!: string;

	@Column({type: "varchar"})
	_zipCode!: string;

	@Column({type: "varchar"})
	_streetType!: string;

	@Column({type: "varchar"})
	_streetName!: string;

	@Column({type: "varchar"})
	_number!: string;

	@Column({type: "varchar"})
	_residenceType?: string;

	@Column({type: "varchar"})
	_neighborhood!: string;

	@Column({type: "varchar"})
	_city!: string;

	@Column({type: "varchar"})
	_state!: string;

	@ManyToOne(() => CountryModel, {cascade: true})
	@JoinColumn()
	_country!: CountryModel;

	@Column({type: "enum", enum: AddressType})
	_type!: AddressType;

	@Column({type: "varchar"})
	_observation?: string;

	@ManyToOne(() => ClientModel, (client: ClientModel) => client.addresses)
	@JoinColumn()
	_client!: ClientModel;

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
			type: AddressType
	) {
			super();
			this._zipCode = zipCode;
			this._number = number;
			this._residenceType = residenceType;
			this._streetName = streetName;
			this._streetType = streetType;
			this._neighborhood = neighborhood;
			this._shortPhrase = shortPhrase;
			this._observation = observation;
			this._city = city;
			this._state = state;
			this._country = country;
			this._type = type;
	}

	get shortPhrase(): string {
		return this._shortPhrase;
	}

	set shortPhrase(value: string) {
		this._shortPhrase = value;
	}

	get zipCode(): string {
		return this._zipCode;
	}

	set zipCode(value: string) {
		this._zipCode = value;
	}

	get streetType(): string {
		return this._streetType;
	}

	set streetType(value: string) {
		this._streetType = value;
	}

	get streetName(): string {
		return this._streetName;
	}

	set streetName(value: string) {
		this._streetName = value;
	}

	get number(): string {
		return this._number;
	}

	set number(value: string) {
		this._number = value;
	}

	get residenceType(): string | undefined {
		return this._residenceType;
	}

	set residenceType(value: string) {
		this._residenceType = value;
	}

	get neighborhood(): string {
		return this._neighborhood;
	}

	set neighborhood(value: string) {
		this._neighborhood = value;
	}

	get city(): string {
		return this._city;
	}

	set city(value: string) {
		this._city = value;
	}

	get state(): string {
		return this._state;
	}

	set state(value: string) {
		this._state = value;
	}

	get country(): CountryModel {
		return this._country;
	}

	set country(value: CountryModel) {
		this._country = value;
	}

	get type(): AddressType {
		return this._type;
	}

	set type(value: AddressType) {
		this._type = value;
	}

	get observation(): string | undefined {
		return this._observation;
	}

	set observation(value: string) {
		this._observation = value;
	}

	get client(): ClientModel {
		return this._client;
	}

	set client(value: ClientModel) {
		this._client = value;
	}

	 toDomain(): Address {
		return new Address(
			this._zipCode, this._number,
			this._residenceType || "",
			this._streetName, this._streetType,
			this._neighborhood,	this._shortPhrase,
			this._observation || "",
			this._city, this._state,
			this._country, this._type
		);
	}
}
