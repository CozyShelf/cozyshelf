export default class NoClientsFound extends Error {
	public constructor(id?: string) {
		const message = id
			? `Cliente não encontrado! Nenhum cliente foi encontrado com o ID: ${id}`
			: "Nenhum cliente cadastrado! Não há clientes cadastrados na base de dados.";

		super(message);
	}
}
