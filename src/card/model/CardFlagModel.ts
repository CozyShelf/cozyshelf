import {Column, Entity, OneToMany} from "typeorm";
import GenericModel from "../../generic/model/GenericModel";

@Entity()
export default class CardFlagModel extends GenericModel {
	@Column({type: "varchar"})
	_description!: string;

	@OneToMany(() => CardFlagModel, (cardFlag: CardFlagModel) => cardFlag._cards)
	_cards!: CardFlagModel[];

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

	get cards(): CardFlagModel[] {
		return this._cards;
	}

	set cards(value: CardFlagModel[]) {
		this._cards = value;
	}
}
