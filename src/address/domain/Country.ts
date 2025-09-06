import DomainEntity from "../../generic/domain/DomainEntity";
import ICountryData from "../types/ICountryData";

export default class Country extends DomainEntity {
	_name!: string;
	_acronym!: string;

	constructor(name: string, acronym: string) {
		super();
		this.name = name;
		this.acronym = acronym;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get acronym(): string {
		return this._acronym;
	}

	set acronym(value: string) {
		this._acronym = value;
	}

	public static fromRequestData(requestData: ICountryData) {
		return new Country(requestData.name, requestData.acronym);
	}
}
