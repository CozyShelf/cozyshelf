import Country from "./Country";
import AddressType from "./enums/AddressType";
import InvalidZipCode from "./exceptions/InvalidZipCode";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";
import IAddressData from "../types/IAddressData";
import DomainEntity from "../../generic/domain/DomainEntity";
import IUpdateAddressData from "../types/IUpdateAddressData";

export default class Address extends DomainEntity {
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
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("residenceType");
		}
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
		if (!value) {
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

	public static fromRequestData(requestData: IAddressData) {
		return new Address(
			requestData.zipCode,
			requestData.number,
			requestData.residenceType,
			requestData.streetName,
			requestData.streetType,
			requestData.neighborhood,
			requestData.shortPhrase,
			requestData.observation,
			requestData.city,
			requestData.state,
			Country.fromRequestData(requestData.country),
			requestData.type
		);
	}

	public updateData(updatedAddresData: IUpdateAddressData) {
		if (updatedAddresData.shortPhrase) {
			this.shortPhrase = updatedAddresData.shortPhrase;
		}
		if (updatedAddresData.zipCode) {
			this.zipCode = updatedAddresData.zipCode;
		}
		if (updatedAddresData.streetType) {
			this.streetType = updatedAddresData.streetType;
		}
		if (updatedAddresData.streetName) {
			this.streetName = updatedAddresData.streetName;
		}
		if (updatedAddresData.number) {
			this.number = updatedAddresData.number;
		}
		if (updatedAddresData.residenceType) {
			this.residenceType = updatedAddresData.residenceType;
		}
		if (updatedAddresData.neighborhood) {
			this.neighborhood = updatedAddresData.neighborhood;
		}
		if (updatedAddresData.city) {
			this.city = updatedAddresData.city;
		}
		if (updatedAddresData.state) {
			this.state = updatedAddresData.state;
		}
		if (updatedAddresData.type) {
			this.type = updatedAddresData.type;
		}
		if (updatedAddresData.observation) {
			this.observation = updatedAddresData.observation;
		}
		if (updatedAddresData.country) {
			this.country.updateData(updatedAddresData.country);
		}
	}
}
