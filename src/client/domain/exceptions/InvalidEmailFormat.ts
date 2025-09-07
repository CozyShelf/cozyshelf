import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidEmailFormat extends DomainException {
	constructor(invalidEmail: string = "") {
		super(
			`Email inválido! O email "${invalidEmail}" não possui um formato válido. Utilize o formato: exemplo@dominio.com`
		);
	}
}
