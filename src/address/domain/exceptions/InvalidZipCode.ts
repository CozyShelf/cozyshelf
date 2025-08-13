import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidZipCode extends DomainException {
	constructor(invalidZipCode: string = "") {
		super(`The provided CEP "${invalidZipCode}" is invalid.`);
	}
}
