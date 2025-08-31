import {Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import CardFlagModel from "./CardFlagModel";
import ClientModel from "../../client/model/ClientModel";
import GenericModel from "../../generic/model/GenericModel";

@Entity("card")
export default class CreditCardModel extends GenericModel {
	@Column({type: "varchar"})
	_number!: string;

	@Column({type: "varchar"})
	_nameOnCard!: string;

	@Column({type: "varchar"})
	_cvv!: string;

	@Column({type: "boolean", default: false})
	_isPreferred!: boolean;

	@ManyToOne(() => CardFlagModel, {cascade: true})
	@JoinColumn()
	_cardFlag!: CardFlagModel;

	@ManyToOne(() => ClientModel, (client: ClientModel) => client.cards) 
	@JoinColumn()
	private _client!: ClientModel;

	constructor(
		number: string,
		nameOnCard: string,
		cvv: string,
		isPreferred: boolean,
		cardFlag: CardFlagModel,
		client: ClientModel
	) {
		super();
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
		this._number = value;
	}

	get nameOnCard(): string {
		return this._nameOnCard;
	}

	set nameOnCard(value: string) {
		this._nameOnCard = value;
	}

	get cvv(): string {
		return this._cvv;
	}

	set cvv(value: string) {
		this._cvv = value;
	}

	get isPreferred(): boolean {
		return this._isPreferred;
	}

	set isPreferred(value: boolean) {
		this._isPreferred = value;
	}

	get cardFlag(): CardFlagModel {
		return this._cardFlag;
	}

	set cardFlag(value: CardFlagModel) {
		this._cardFlag = value;
	}

	get client(): ClientModel {
		return this._client;
	}

	set client(value: ClientModel) {
		this._client = value;
	}
}
