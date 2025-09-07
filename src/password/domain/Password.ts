import DomainEntity from "../../generic/domain/DomainEntity";
import IPasswordData from "../types/IPasswordData";
import InvalidPasswordConfirmation from "./exceptions/InvalidPasswordConfirmation";
import InvalidPasswordStrength from "./exceptions/InvalidPasswordStrength";
import { genSaltSync, hashSync } from "bcrypt";

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

		const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/;
		if (!passwordRegex.test(password)) {
			throw new InvalidPasswordStrength();
		}

		if (!(password == requestData.confirmation)) {
			throw new InvalidPasswordConfirmation();
		}

		const encryptedPassword = Password.encrytPassword(password);
		return new Password(encryptedPassword);
	}

	public static encrytPassword(notEncryptedPassword: string) {
		const salt = genSaltSync(10);
		return hashSync(notEncryptedPassword, salt);
	}

	public static isEncrypted(value: string): boolean {
		return /^\$2[abxy]\$\d{2}\$.{53}$/.test(value);
	}
}
