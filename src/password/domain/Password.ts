import DomainEntity from "../../generic/domain/DomainEntity";
import IPasswordData from "../types/IPasswordData";
import InvalidPasswordConfirmation from "./exceptions/InvalidPasswordConfirmation";
import InvalidPasswordStrength from "./exceptions/InvalidPasswordStrength";

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
		const senhaRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/;
		if (!senhaRegex.test(value)) {
			throw new InvalidPasswordStrength();
		}

		this._value = value;
	}

	public static fromRequestData(requestData: IPasswordData) {
		if (!(requestData.value == requestData.confirmation)) {
			throw new InvalidPasswordConfirmation();
		}

		return new Password(requestData.value);
	}
}
