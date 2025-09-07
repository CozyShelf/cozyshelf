import Client from "../domain/Client";

export default class ClientListDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly email: string;
	public readonly telephoneNumber: string;

	constructor(
		id: string,
		name: string,
		email: string,
		telephoneNumber: string
	) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.telephoneNumber = telephoneNumber;
	}

	public static fromEntity(client: Client): ClientListDTO {
		return new ClientListDTO(
			client.id,
			client.name,
			client.email,
			client.telephone.number
		);
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
}
