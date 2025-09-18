import { Column, Entity } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import CardFlag from "../domain/CardFlag";

@Entity()
export default class CardFlagModel extends GenericModel {
	@Column({ type: "varchar" })
	description!: string;

	constructor(description: string, isActive: boolean) {
		super();
		this.description = description;
		this.isActive = isActive;
	}

	public toEntity(): CardFlag {
		const cardFlag = new CardFlag(this.description);
		cardFlag.id = this.id;
		cardFlag.isActive = this.isActive;
		return cardFlag;
	}

	public static fromEntity(cardFlag: CardFlag): CardFlagModel {
		return new CardFlagModel(cardFlag.description, cardFlag.isActive);
	}

	public updateFromEntity(updatedCardFlag: CardFlag) {
		if (updatedCardFlag.description != this.description) {
			this.description = updatedCardFlag.description;
		}
	}
}
