export default class CardNotFound extends Error {
	constructor(cardId: string) {
		super(`Cartão com ID: ${cardId} não foi encontrado!`);
		this.name = "CardNotFound";
	}
}
