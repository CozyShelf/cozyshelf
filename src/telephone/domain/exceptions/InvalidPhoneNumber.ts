import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPhoneNumber extends DomainException {
	constructor(invalidNumber: string) {
		super(`The provided number: ${invalidNumber} is invalid.`);
	}
}
