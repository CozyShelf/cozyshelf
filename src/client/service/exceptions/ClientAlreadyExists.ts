export default class ClientAlreadyExists extends Error {
	constructor() {
		super(
			`Cliente já cadastrado! Já existe um cliente com esse CPF ou email em nossa base de dados.`
		);
	}
}
