import CardFlag from "./CardFlag";
import Client from "./Client";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";

export default class CreditCard {
	_number!: string;
	_nameOnCard!: string;
	_cvv!: string;
	_isPreferred!: boolean;
	_cardFlag!: CardFlag;
	_client!: Client;

	constructor(
		number: string,
		nameOnCard: string,
		cvv: string,
		isPreferred: boolean,
		cardFlag: CardFlag,
		client: Client
	) {
		this._number = number;
		this._nameOnCard = nameOnCard;
		this._cvv = cvv;
		this._isPreferred = isPreferred;
		this._cardFlag = cardFlag;
		this._client = client;
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

	get client(): Client {
		return this._client;
	}

	set client(value: Client) {
		this._client = value;
	}

}
