export default class NotAvailableInStock extends Error {
	constructor(
		bookName: string,
		invalidQuantity: number,
		availableQuantity: number
	) {
		super(
			`Estoque insuficiente para o livro ${bookName}. Quantidade solicitada: ${invalidQuantity}, em estoque: ${availableQuantity}`
		);
	}
}
