export default class NoCartItemsFound extends Error {
	public constructor(clientID: string) {
		super(
			`Nenhum item cadastrado! Nenhum item no carrinho do cliente ${clientID}`
		);
	}
}
