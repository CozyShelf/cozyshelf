import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidCardsProvided extends DomainException {
	constructor() {
		super("At least one card must be marked as preferred");
	}
}
