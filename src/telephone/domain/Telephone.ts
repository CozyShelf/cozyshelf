import TelephoneType from "./enums/TelephoneType";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";
import ITelephoneData from "../types/ITelephoneData";
import DomainEntity from "../../generic/domain/DomainEntity";
import InvalidPhoneNumber from "./exceptions/InvalidPhoneNumber";
import IUpdateTelephoneData from "../types/IUpdateTelephoneData";

export default class Telephone extends DomainEntity {
	private _ddd!: string;
	private _number!: string;
	private _type!: TelephoneType;

	constructor(ddd: string, number: string, type: TelephoneType) {
		super();
		this.ddd = ddd;
		this.number = number;
		this.type = type;
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
		if (!value) {
			throw new MandatoryParameter("telephoneNumber");
		}

		if (value.trim().length < 9) {
			throw new InvalidPhoneNumber(value);
		}

		this._number = value;
	}

	get type(): TelephoneType {
		return this._type;
	}

	set type(value: TelephoneType) {
		this._type = value;
	}

	public static fromRequestData(requestData: ITelephoneData) {
		return new Telephone(requestData.ddd, requestData.number, requestData.type);
	}

	public updateData(updatedData: IUpdateTelephoneData) {
		if (updatedData.number) {
			this.number = updatedData.number;
		}
		if (updatedData.ddd) {
			this.ddd = updatedData.ddd;
		}
		if (updatedData.type) {
			this.type = updatedData.type;
		}
	}

	public inactivate() {
		this.isActive = false;
	}
}
