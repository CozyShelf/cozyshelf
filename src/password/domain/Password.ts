import InvalidPasswordStrength from "./exceptions/InvalidPasswordStrength";

export default class Password {
	private _value: string;
	private _force: number;

	constructor(
		value: string,
		force: number
	) {
		this._value = value;
		this._force = force;
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

	//NOTE: Nao precisa de force...
	get force(): number {
		return this._force;
	}

	set force(value: number) {
		this._force = value;
	}
}
