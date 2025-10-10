export default class InsufficientStockException extends Error {
	constructor(
		bookName: string,
		requestedQuantity: number,
		availableStock: number
	) {
		super(
			`Estoque insuficiente para o livro "${bookName}". Quantidade solicitada: ${requestedQuantity}, Disponível em estoque: ${availableStock}`
		);
		this.name = "InsufficientStockException";
	}
}
