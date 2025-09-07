import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPasswordConfirmation extends DomainException {
	constructor() {
		super(
			`As senhas não coincidem! Por favor, certifique-se de que a senha e a confirmação sejam idênticas.`
		);
	}
}
