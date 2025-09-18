export default class NoCardsFound extends Error {
	constructor(cardId?: string) {
		let message = cardId
			? `Cartão com ID: ${cardId} não foi encontrado!`
			: `Nenhum cartão foi encontrado!`;

		super(message);
		this.name = "NoCardsFound";
	}
}
