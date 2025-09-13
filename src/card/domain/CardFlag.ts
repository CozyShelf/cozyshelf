import DomainEntity from "../../generic/domain/DomainEntity";
import ICardFlagData from "../types/ICardFlagData";

export default class CardFlag extends DomainEntity {
	_description!: string;

	constructor(description: string) {
		super();
		this.description = description;
	}

	get description(): string {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}

	public static fromRequestData(requestData: ICardFlagData) {
		return new CardFlag(requestData.description);
	}

	public updateData(updatedCardFlagData: ICardFlagData) {
		if (updatedCardFlagData.description) {
			this.description = updatedCardFlagData.description;
		}
	}

	public inactivate() {
		this.isActive = false;
	}
}
