import CreditCard from "../domain/CreditCard";

export default class CardListDTO {
	public readonly id: string;
	public readonly maskedNumber: string;
	public readonly nameOnCard: string;
	public readonly isPreferred: boolean;
	public readonly flagDescription: string;

	constructor(
		id: string,
		maskedNumber: string,
		nameOnCard: string,
		isPreferred: boolean,
		flagDescription: string
	) {
		this.id = id;
		this.maskedNumber = maskedNumber;
		this.nameOnCard = nameOnCard;
		this.isPreferred = isPreferred;
		this.flagDescription = flagDescription;
	}

	public static fromEntity(card: CreditCard): CardListDTO {
		const maskedNumber =
			card.number.length >= 4
				? `**** **** **** ${card.number.slice(-4)}`
				: card.number;

		return new CardListDTO(
			card.id,
			maskedNumber,
			card.nameOnCard,
			card.isPreferred,
			card.cardFlag.description
		);
	}

	public get preferredDisplay(): string {
		return this.isPreferred ? "Preferencial" : "Normal";
	}

	public get shortDisplay(): string {
		return `${this.flagDescription} ${this.maskedNumber}`;
	}
}
