import CardFlag from "../domain/CardFlag";

export default class CardFlagListDTO {
	public readonly id: string;
	public readonly description: string;

	constructor(id: string, description: string) {
		this.id = id;
		this.description = description;
	}

	public static fromEntity(cardFlag: CardFlag): CardFlagListDTO {
		return new CardFlagListDTO(cardFlag.id, cardFlag.description);
	}

	public get displayName(): string {
		return this.description;
	}

	public get value(): string {
		return this.description;
	}

	public get label(): string {
		return this.description;
	}
}
