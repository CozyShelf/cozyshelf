import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidEmailFormat extends DomainException {
	constructor(invalidEmail: string = "") {
		super(`The provided email "${invalidEmail}" is invalid.`);
	}
}
