import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidCPFFormat extends DomainException {
	constructor(invalidCPF: string = "") {
		super(
			`CPF inválido! O CPF '${invalidCPF}' não é válido. Utilize o formato: 000.000.000-00.`
		);
	}
}
