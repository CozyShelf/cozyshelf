import CardFlag from "./CardFlag";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";
import ICardData from "../types/ICardData";
import IUpdateCardData from "../types/IUpdateCardData";
import DomainEntity from "../../generic/domain/DomainEntity";

export default class CreditCard extends DomainEntity {
	_number!: string;
	_nameOnCard!: string;
	_cvv!: string;
	_isPreferred!: boolean;
	_cardFlag!: CardFlag;

	constructor(
		number: string,
		nameOnCard: string,
		cvv: string,
		isPreferred: boolean,
		cardFlag: CardFlag
	) {
		super();
		this.number = number;
		this.nameOnCard = nameOnCard;
		this.cvv = cvv;
		this.isPreferred = isPreferred;
		this.cardFlag = cardFlag;
	}

	get number(): string {
		return this._number;
	}

	set number(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("creditCardNumber");
		}
		this._number = value;
	}

	get nameOnCard(): string {
		return this._nameOnCard;
	}

	set nameOnCard(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("nameOnCard");
		}
		this._nameOnCard = value;
	}

	get cvv(): string {
		return this._cvv;
	}

	set cvv(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("cvv");
		}
		this._cvv = value;
	}

	get isPreferred(): boolean {
		return this._isPreferred;
	}

	set isPreferred(value: boolean) {
		this._isPreferred = value;
	}

	get cardFlag(): CardFlag {
		return this._cardFlag;
	}

	set cardFlag(value: CardFlag) {
		if (!value) {
			throw new MandatoryParameter("cardFlag");
		}
		this._cardFlag = value;
	}

	public static fromRequestData(requestData: ICardData) {
		return new CreditCard(
			requestData.number,
			requestData.nameOnCard,
			requestData.cvv,
			requestData.isPreferred,
			CardFlag.fromRequestData(requestData.cardFlag)
		);
	}

	public updateData(updatedCardData: IUpdateCardData) {
		if (updatedCardData.number) {
			this.number = updatedCardData.number;
		}
		if (updatedCardData.nameOnCard) {
			this.nameOnCard = updatedCardData.nameOnCard;
		}
		if (updatedCardData.cvv) {
			this.cvv = updatedCardData.cvv;
		}
		if (updatedCardData.isPreferred !== undefined) {
			this.isPreferred = updatedCardData.isPreferred;
		}
		if (updatedCardData.cardFlag) {
			this.cardFlag.updateData(updatedCardData.cardFlag);
		}
	}
}
