export default class CardAlreadyExists extends Error {
	constructor() {
		super(
			`Cartão já cadastrado! Já existe um cartão com esse número em nossa base de dados.`
		);
	}
}
