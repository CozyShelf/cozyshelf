export default class Country {
	_name!: string;
	_acronym!: string;

	constructor(name: string, acronym: string) {
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
