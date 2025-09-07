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

	public get htmlBirthDate(): string {
		return this.birthDate.toISOString().split("T")[0];
	}

	public get genderDisplay(): string {
		switch (this.gender) {
			case Gender.MALE:
				return "Masculino";
			case Gender.FEMALE:
				return "Feminino";
			case Gender.OTHER:
				return "Outros";
			default:
				return "Não informado";
		}
	}

	public get formattedTelephone(): string {
		const cleaned = this.telephoneNumber.replace(/\D/g, "");
		if (cleaned.length === 11) {
			return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
				7
			)}`;
		}
		if (cleaned.length === 10) {
			return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
				6
			)}`;
		}
		return this.telephoneNumber;
	}

	public get telephoneTypeDisplay(): string {
		return this.telephoneType === "MOBILE" ? "Móvel" : "Fixo";
	}

	public get primaryAddress(): AddressDetailsDTO | undefined {
		return this.addresses.find(
			(addr) => addr.type === "DELIVERY_AND_BILLING" || addr.type === "DELIVERY"
		);
	}

	public get preferredCard(): CardDetailsDTO | undefined {
		return this.cards.find((card) => card.isPreferred);
	}
}
