import Country from "./Country";
import AddressType from "./enums/AddressType";
import InvalidZipCode from "./exceptions/InvalidZipCode";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";
import Client from "../../client/domain/Client";

export default class Address {
	_shortPhrase!: string;
	_zipCode!: string;
	_streetType!: string;
	_streetName!: string;
	_number!: string;
	_residenceType?: string;
	_neighborhood!: string;
	_city!: string;
	_state!: string;
	_country!: Country;
	_type!: AddressType;
	_observation?: string;
	_client!: Client;

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
		country: Country,
		type: AddressType
	) {
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
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("shortPhrase");
		}
		this._shortPhrase = value;
	}

	get zipCode(): string {
		return this._zipCode;
	}

	set zipCode(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("zipCode");
		}

		const cepRegex: RegExp = /\d{5}-\d{3}/;
		if (!cepRegex.test(value)) {
			throw new InvalidZipCode(value);
		}

		this._zipCode = value;
	}

	get streetType(): string {
		return this._streetType;
	}

	set streetType(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("streetType");
		}
		this._streetType = value;
	}

	get streetName(): string {
		return this._streetName;
	}

	set streetName(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("streetName");
		}
		this._streetName = value;
	}

	get number(): string {
		return this._number;
	}

	set number(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("number");
		}
		this._number = value;
	}

	get residenceType(): string {
		return this._residenceType ?? "";
	}

	set residenceType(value: string) {
		this._residenceType = value;
	}

	get neighborhood(): string {
		return this._neighborhood;
	}

	set neighborhood(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("neighborhood");
		}
		this._neighborhood = value;
	}

	get city(): string {
		return this._city;
	}

	set city(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("city");
		}
		this._city = value;
	}

	get state(): string {
		return this._state;
	}

	set state(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("state");
		}
		this._state = value;
	}

	get country(): Country {
		return this._country;
	}

	set country(value: Country) {
		if (!value || !value.name || value.name.trim().length === 0) {
			throw new MandatoryParameter("country");
		}
		this._country = value;
	}

	get type(): AddressType {
		return this._type;
	}

	set type(value: AddressType) {
		if (!this._type) {
			throw new MandatoryParameter("addressType");
		}
		this._type = value;
	}

	get observation(): string {
		return this._observation ?? "";
	}

	set observation(value: string) {
		this._observation = value;
	}

	get client(): Client {
		return this._client;
	}

	set client(value: Client) {
		this._client = value;
	}
}
