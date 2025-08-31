import { Column, Entity, OneToOne } from "typeorm";
import TelephoneType from "../domain/enums/TelephoneType";
import GenericModel from "../../generic/model/GenericModel";
import ClientModel from "../../client/model/ClientModel";

@Entity()
export default class TelephoneModel extends GenericModel {
	@Column({ type: "varchar" }) private _ddd: string;

	@Column({ type: "varchar" }) private _number: string;

	@Column({ type: "enum", enum: TelephoneType }) private _type: TelephoneType;

	@OneToOne(() => ClientModel, (client) => client._telephone)
	_client?: ClientModel;

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
