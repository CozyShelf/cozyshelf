export default class InvalidQuantityProvided extends Error {
	public constructor(invalidValue: number) {
		super(
			`Quantidade inválida ! ${invalidValue} não é uma quantidade aceitável para se adicionar ao carrinho`
		);
	}
}
