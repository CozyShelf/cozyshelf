import Client from "../domain/Client";

export default class ClientListDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly email: string;

	constructor(
		id: string,
		name: string,
		email: string
	) {
		this.id = id;
		this.name = name;
		this.email = email;
	}

	public static fromEntity(client: Client): ClientListDTO {
		return new ClientListDTO(
			client.id,
			client.name,
			client.email
		);
	}
}
