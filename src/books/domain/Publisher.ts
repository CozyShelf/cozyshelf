import DomainEntity from "../../generic/domain/DomainEntity";

export default class Publisher extends DomainEntity {
	_description!: string;

	constructor(description: string) {
		super();
		this._description = description;
	}

	get description(): string {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}
}
