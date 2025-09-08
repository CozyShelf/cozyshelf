export default class PasswordsNotMatch extends Error {
	constructor(invalidPassword: string) {
		super(
			`Senha inválida ! A senha inserida não bate com a senha atual`
		);
	}
}
