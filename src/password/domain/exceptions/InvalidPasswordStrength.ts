import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPasswordStrength extends DomainException {
	constructor() {
		super(`The provided password is invalid. The password must be composed of at least 8 characters, contain uppercase and lowercase letters, and contain special characters.`);
	}
}
