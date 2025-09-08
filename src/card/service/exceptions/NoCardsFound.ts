export default class NoCardsFound extends Error {
	constructor() {
		super("Nenhum cartão foi encontrado!");
		this.name = "NoCardsFound";
	}
}
