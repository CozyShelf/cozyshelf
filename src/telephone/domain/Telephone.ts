import TelephoneType from "./enums/TelephoneType";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";

export default class Telephone {
	private _ddd: string;
	private _number: string;
	private _type: TelephoneType;

	constructor(ddd: string, number: string, type: TelephoneType) {
		this._ddd = ddd;
		this._number = number;
		this._type = type;
	}

	get ddd(): string {
		return this._ddd;
	}

	set ddd(value: string) {
		if (value.trim().length !== 2) {
			throw new MandatoryParameter("ddd");
		}
		this._ddd = value;
	}

	get number(): string {
		return this._number;
	}

	set number(value: string) {
		if (!value || value.trim().length < 9) {
			throw new MandatoryParameter("telephoneNumber");
		}
		this._number = value;
	}

	get type(): TelephoneType {
		return this._type;
	}

	set type(value: TelephoneType) {
		this._type = value;
	}
}
