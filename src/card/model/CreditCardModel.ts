import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import CardFlagModel from "./CardFlagModel";
import ClientModel from "../../client/model/ClientModel";
import GenericModel from "../../generic/model/GenericModel";
import CreditCard from "../domain/CreditCard";

@Entity("card")
export default class CreditCardModel extends GenericModel {
	@Column({ type: "varchar" })
	number!: string;

	@Column({ type: "varchar" })
	nameOnCard!: string;

	@Column({ type: "varchar" })
	cvv!: string;

	@Column({ type: "boolean", default: false })
	isPreferred!: boolean;

	@ManyToOne(() => CardFlagModel, { eager: true })
	@JoinColumn()
	cardFlag!: CardFlagModel;

	flagDescription: string;

	@ManyToOne(() => ClientModel, (client: ClientModel) => client.cards)
	@JoinColumn()
	client!: ClientModel;

	constructor(
		number: string,
		nameOnCard: string,
		cvv: string,
		isPreferred: boolean,
		flagDescription: string
	) {
		super();
		this.number = number;
		this.nameOnCard = nameOnCard;
		this.cvv = cvv;
		this.isPreferred = isPreferred;
		this.flagDescription = flagDescription;
	}

	public toEntity(): CreditCard {
		const cardFlag = this.cardFlag.toEntity();

		const card = new CreditCard(
			this.number,
			this.nameOnCard,
			this.cvv,
			this.isPreferred,
			cardFlag
		);
		card.id = this.id;

		return card;
	}

	public static fromEntity(card: CreditCard): CreditCardModel {
		return new CreditCardModel(
			card.number,
			card.nameOnCard,
			card.cvv,
			card.isPreferred,
			card.cardFlag.description
		);
	}

	public updateFromEntity(updatedCard: CreditCard) {
		if (updatedCard.number != this.number) {
			this.number = updatedCard.number;
		}
		if (updatedCard.nameOnCard != this.nameOnCard) {
			this.nameOnCard = updatedCard.nameOnCard;
		}
		if (updatedCard.cvv != this.cvv) {
			this.cvv = updatedCard.cvv;
		}
		if (updatedCard.isPreferred != this.isPreferred) {
			this.isPreferred = updatedCard.isPreferred;
		}
		if (updatedCard.cardFlag.description != this.flagDescription) {
			this.flagDescription = updatedCard.cardFlag.description;
		}
		this.cardFlag.updateFromEntity(updatedCard.cardFlag);
	}
}
