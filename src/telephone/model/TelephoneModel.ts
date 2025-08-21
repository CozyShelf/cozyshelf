import { Column, Entity } from "typeorm";
import TelephoneType from "../domain/enums/TelephoneType";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class TelephoneModel extends GenericModel {
	@Column({ type: "varchar" }) private _ddd: string;

	@Column({ type: "varchar" }) private _number: string;

	@Column({ type: "varchar" }) private _type: TelephoneType;

	constructor(ddd: string, number: string, type: TelephoneType) {
		super();
		this._ddd = ddd;
		this._number = number;
		this._type = type;
	}

	get ddd(): string {
		return this._ddd;
	}

	set ddd(value: string) {
		this._ddd = value;
	}

	get number(): string {
		return this._number;
	}

	set number(value: string) {
		this._number = value;
	}

	get type(): TelephoneType {
		return this._type;
	}

	set type(value: TelephoneType) {
		this._type = value;
	}
}
