import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidPasswordStrength extends DomainException {
	constructor() {
		super(
			`Senha inválida! A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas, números e caracteres especiais (@, #, $, %, etc.).`
		);
	}
}
