import DomainException from "./DomainException";

export default class MandatoryParameter extends DomainException {
	constructor(parameterName: string) {
		super(
			`Campo obrigatório! O campo '${parameterName}' é obrigatório e não pode estar vazio.`
		);
	}
}
