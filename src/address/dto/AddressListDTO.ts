import Address from "../domain/Address";
import AddressType from "../domain/enums/AddressType";

export default class AddressListDTO {
	public readonly id: string;
	public readonly shortPhrase: string;
	public readonly fullAddress: string;
	public readonly type: AddressType;
	public readonly city: string;
	public readonly state: string;

	constructor(
		id: string,
		shortPhrase: string,
		fullAddress: string,
		type: AddressType,
		city: string,
		state: string
	) {
		this.id = id;
		this.shortPhrase = shortPhrase;
		this.fullAddress = fullAddress;
		this.type = type;
		this.city = city;
		this.state = state;
	}

	public static fromEntity(address: Address): AddressListDTO {
		const fullAddress = [
			address.streetType,
			address.streetName,
			address.number,
			address.neighborhood,
		]
			.filter((part) => part && part.trim())
			.join(", ");

		return new AddressListDTO(
			address.id,
			address.shortPhrase,
			fullAddress,
			address.type,
			address.city,
			address.state
		);
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

	public get locationDisplay(): string {
		return `${this.city}/${this.state}`;
	}
}
