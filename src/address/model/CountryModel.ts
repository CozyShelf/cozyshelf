import {Column, Entity} from "typeorm";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class CountryModel extends GenericModel {
	@Column({type: "varchar"})
	_name!: string;

	@Column({type: "varchar"})
	_acronym!: string;

	constructor(name: string, acronym: string) {
		super();
		this._name = name;
		this._acronym = acronym;
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
}
