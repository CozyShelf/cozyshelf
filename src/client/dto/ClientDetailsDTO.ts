import Client from "../domain/Client";
import Gender from "../domain/enums/Gender";
import AddressDetailsDTO from "../../address/dto/AddressDetailsDTO";
import CardDetailsDTO from "../../card/dto/CardDetailsDTO";

export default class ClientDetailsDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly email: string;
	public readonly cpf: string;
	public readonly birthDate: Date;
	public readonly gender: Gender;
	public readonly ranking: number;
	public readonly telephoneNumber: string;
	public readonly telephoneType: string;
	public readonly telephoneDdd: string;
	public readonly addresses: AddressDetailsDTO[];
	public readonly cards: CardDetailsDTO[];

	constructor(
		id: string,
		name: string,
		email: string,
		cpf: string,
		birthDate: Date,
		gender: Gender,
		ranking: number,
		telephoneNumber: string,
		telephoneType: string,
		telephoneDdd: string,
		addresses: AddressDetailsDTO[],
		cards: CardDetailsDTO[]
	) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.cpf = cpf;
		this.birthDate = birthDate;
		this.gender = gender;
		this.ranking = ranking;
		this.telephoneNumber = telephoneNumber;
		this.telephoneType = telephoneType;
		this.telephoneDdd = telephoneDdd;
		this.addresses = addresses;
		this.cards = cards;
	}

	public static fromEntity(client: Client): ClientDetailsDTO {
		return new ClientDetailsDTO(
			client.id,
			client.name,
			client.email,
			client.cpf,
			client.birthDate,
			client.gender,
			client.ranking,
			client.telephone.number,
			client.telephone.type,
			client.telephone.ddd,
			client.addresses.map((address) => AddressDetailsDTO.fromEntity(address)),
			client.cards.map((card) => CardDetailsDTO.fromEntity(card))
		);
	}

	public get formattedCpf(): string {
		return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
	}

	public get formattedBirthDate(): string {
		return this.birthDate.toLocaleDateString("pt-BR");
	}

	public get formattedTelephone(): string {
		const cleaned = this.telephoneNumber.replace(/\D/g, "");
		if (cleaned.length === 9) {
			return `(${this.telephoneDdd}) ${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
		}
		if (cleaned.length === 8) {
			return `(${this.telephoneDdd}) ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
		}
		return `(${this.telephoneDdd}) ${this.telephoneNumber}`;
	}

	public get primaryAddress(): AddressDetailsDTO | undefined {
		return this.addresses.find(
			(addr) => addr.type === "DELIVERY_AND_BILLING" || addr.type === "DELIVERY" || addr.type === "BILLING"
		);
	}

	public get preferredCard(): CardDetailsDTO | undefined {
		return this.cards.find((card) => card.isPreferred);
	}
}
