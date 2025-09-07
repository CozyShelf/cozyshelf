export default class NoClientsFound extends Error {
	public constructor(id?: string) {
		const message = id
			? `Nenhum cliente encontrado com o id: ${id}`
			: "Nenhum cliente cadastrado na base de dados";

		super(message);
	}
}
