import {Column, Entity} from "typeorm";

@Entity()
export default class PasswordModel {
	@Column({ type: "string" })
	_value: string;

	@Column({ type: "int" })
	_force: number;

	constructor(value: string, force: number) {
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
