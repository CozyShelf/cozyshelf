import Client from "../domain/Client";

export default class ClientListDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly email: string;
	public readonly cpf: string;
	public readonly ranking: number;

	constructor(
		id: string,
		name: string,
		email: string,
		cpf: string,
		ranking: number
	) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.cpf = cpf;
		this.ranking = ranking;
	}

	public static fromEntity(client: Client): ClientListDTO {
		return new ClientListDTO(
			client.id,
			client.name,
			client.email,
			client.cpf,
			client.ranking
		);
	}

	public get formattedCpf(): string {
		return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
	}
}
