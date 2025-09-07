import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidCardsProvided extends DomainException {
	constructor() {
		super(
			"Cartão preferencial obrigatório! É necessário selecionar pelo menos um cartão como preferencial."
		);
	}
}
