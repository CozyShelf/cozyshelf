import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPhoneNumber extends DomainException {
	constructor(invalidNumber: string) {
		super(
			`Número de telefone inválido! O número "${invalidNumber}" não é válido. Utilize o formato: (00) 00000-0000.`
		);
	}
}
