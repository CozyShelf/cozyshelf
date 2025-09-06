import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPasswordConfirmation extends DomainException {
	constructor() {
		super(`The password and the confirmation must be equal.`);
	}
}
