export default class PasswordsNotMatch extends Error {
	constructor(invalidPassword: string) {
		super(
			`Senha inválida ! A senha ${invalidPassword} não bate com a senha atual`
		);
	}
}
