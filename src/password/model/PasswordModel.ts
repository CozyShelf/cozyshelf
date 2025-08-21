import {Column, Entity} from "typeorm";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class PasswordModel extends GenericModel {
	@Column({ type: "varchar" })
	_value: string;

	@Column({ type: "int" })
	_force: number;

	constructor(value: string, force: number) {
		super();
		this._value = value;
		this._force = force;
	}

	get value(): string {
		return this._value;
	}

	set value(value: string) {
		this._value = value;
	}

	get force(): number {
		return this._force;
	}

	set force(value: number) {
		this._force = value;
	}
}
