import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidCPFFormat extends DomainException {
	constructor(invalidCPF: string = "") {
		super(`The provided CPF "${invalidCPF}" is invalid.`);
	}
}
