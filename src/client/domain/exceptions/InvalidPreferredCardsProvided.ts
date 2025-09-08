import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPreferredCardsProvided extends DomainException {
	constructor() {
		super("Só pode haver apenas um cartão marcado como preferencial.");
	}
}
