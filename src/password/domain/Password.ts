import DomainEntity from "../../generic/domain/DomainEntity";
import PasswordsNotMatch from "../service/exceptions/PasswordsNotMatch";
import IPasswordData from "../types/IPasswordData";
import IUpdatePasswordData from "../types/IUpdatePasswordData";
import InvalidPasswordConfirmation from "./exceptions/InvalidPasswordConfirmation";
import InvalidPasswordStrength from "./exceptions/InvalidPasswordStrength";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

export default class Password extends DomainEntity {
	private _value!: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	get value(): string {
		return this._value;
	}

	set value(value: string) {
		this._value = value;
	}

	public static fromRequestData(requestData: IPasswordData) {
		const password = requestData.value;

		Password.validatePassword(password);

		if (
			!Password.validatePasswordConfirmation(password, requestData.confirmation)
		) {
			throw new InvalidPasswordConfirmation();
		}

		const encryptedPassword = Password.encrytPassword(password);
		return new Password(encryptedPassword);
	}

	public updateData(updatedPassData: IUpdatePasswordData) {
		if (!this.comparePasswords(updatedPassData.currentPassword)) {
			throw new PasswordsNotMatch(updatedPassData.currentPassword);
		}

		if (
			!Password.validatePasswordConfirmation(
				updatedPassData.newPassword,
				updatedPassData.newPasswordConfirmation
			)
		) {
			throw new InvalidPasswordConfirmation();
		}

		Password.validatePassword(updatedPassData.newPassword);

		this.value = Password.encrytPassword(updatedPassData.newPassword);
	}

	public static validatePassword(password: string) {
		const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/;
		if (!passwordRegex.test(password)) {
			throw new InvalidPasswordStrength();
		}
	}

	public static validatePasswordConfirmation(
		password: string,
		confirmation: string
	) {
		return password == confirmation;
	}

	public static encrytPassword(notEncryptedPassword: string) {
		const salt = genSaltSync(10);
		return hashSync(notEncryptedPassword, salt);
	}

	public static isEncrypted(value: string): boolean {
		return /^\$2[abxy]\$\d{2}\$.{53}$/.test(value);
	}

	private comparePasswords(plainTextPassword: string) {
		return compareSync(plainTextPassword, this.value);
	}

	public inactivate() {
		this.isActive = false;
	};
}
