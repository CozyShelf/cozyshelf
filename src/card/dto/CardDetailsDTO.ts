import CreditCard from "../domain/CreditCard";
import CreditCardModel from "../model/CreditCardModel";

export default class CardDetailsDTO {
	public readonly id: string;
	public readonly number: string;
	public readonly nameOnCard: string;
	public readonly cvv: string;
	public readonly isPreferred: boolean;
	public readonly flagDescription: string;

	constructor(
		id: string,
		number: string,
		nameOnCard: string,
		cvv: string,
		isPreferred: boolean,
		flagDescription: string
	) {
		this.id = id;
		this.number = number;
		this.nameOnCard = nameOnCard;
		this.cvv = cvv;
		this.isPreferred = isPreferred;
		this.flagDescription = flagDescription;
	}

	public static fromEntity(card: CreditCard): CardDetailsDTO {
		return new CardDetailsDTO(
			card.id,
			card.number,
			card.nameOnCard,
			card.cvv,
			card.isPreferred,
			card.cardFlag.description
		);
	}

	public static fromModel(cardModel: CreditCardModel): CardDetailsDTO {
		return new CardDetailsDTO(
			cardModel.id,
			cardModel.number,
			cardModel.nameOnCard,
			cardModel.cvv,
			cardModel.isPreferred,
			cardModel.flagDescription
		);
	}

	public get maskedNumber(): string {
		if (this.number.length < 4) return this.number;
		const lastFour = this.number.slice(-4);
		return `**** **** **** ${lastFour}`;
	}

	public get maskedCvv(): string {
		return "***";
	}

	public get preferredDisplay(): string {
		return this.isPreferred ? "Sim" : "Não";
	}

	public get formattedNumber(): string {
		return this.number.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
	}

	public get summary(): string {
		return `${this.flagDescription} **** ${this.number.slice(-4)}`;
	}
}
