import Address from "../domain/Address";
import AddressType from "../domain/enums/AddressType";

export default class AddressDetailsDTO {
	public readonly id: string;
	public readonly shortPhrase: string;
	public readonly zipCode: string;
	public readonly streetType: string;
	public readonly streetName: string;
	public readonly number: string;
	public readonly residenceType: string;
	public readonly neighborhood: string;
	public readonly city: string;
	public readonly state: string;
	public readonly country: string;
	public readonly type: AddressType;
	public readonly observation: string;

	constructor(
		id: string,
		shortPhrase: string,
		zipCode: string,
		streetType: string,
		streetName: string,
		number: string,
		residenceType: string,
		neighborhood: string,
		city: string,
		state: string,
		country: string,
		type: AddressType,
		observation: string
	) {
		this.id = id;
		this.shortPhrase = shortPhrase;
		this.zipCode = zipCode;
		this.streetType = streetType;
		this.streetName = streetName;
		this.number = number;
		this.residenceType = residenceType;
		this.neighborhood = neighborhood;
		this.city = city;
		this.state = state;
		this.country = country;
		this.type = type;
		this.observation = observation;
	}

	public static fromEntity(address: Address): AddressDetailsDTO {
		return new AddressDetailsDTO(
			address.id,
			address.shortPhrase,
			address.zipCode,
			address.streetType,
			address.streetName,
			address.number,
			address.residenceType || "",
			address.neighborhood,
			address.city,
			address.state,
			address.country.name,
			address.type,
			address.observation
		);
	}

	public get formattedZipCode(): string {
		return this.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2");
	}

	public get fullAddress(): string {
		const parts = [
			this.streetType,
			this.streetName,
			this.number,
			this.neighborhood,
			this.city,
			this.state,
		].filter((part) => part && part.trim());

		return parts.join(", ");
	}

	public get typeDisplay(): string {
		switch (this.type) {
			case AddressType.DELIVERY:
				return "Entrega";
			case AddressType.BILLING:
				return "Cobrança";
			case AddressType.DELIVERY_AND_BILLING:
				return "Entrega e Cobrança";
			default:
				return "Não especificado";
		}
	}

	public get summary(): string {
		return `${this.streetName}, ${this.number} - ${this.neighborhood}, ${this.city}/${this.state}`;
	}
}
