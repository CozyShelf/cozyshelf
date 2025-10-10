import DomainEntity from "../../generic/domain/DomainEntity";

export default class Author extends DomainEntity {
	_name!: string;

	constructor(name: string) {
		super();
		this._name = name;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}
}
