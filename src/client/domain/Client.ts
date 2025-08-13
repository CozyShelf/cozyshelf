import Gender from "./enums/Gender";
import InvalidEmailFormat from "./exceptions/InvalidEmailFormat";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";
import Password from "../../password/domain/Password";
import Telephone from "../../telephone/domain/Telephone";

export default class Client {
	_name: string;
	_birthDate: Date;
	_cpf: string;
	_email: string;
	_password: Password;
	_ranking: number;
	_telephone: Telephone;
	_gender!: Gender;

	constructor(
		name: string,
		birthDate: Date,
		cpf: string,
		telephone: Telephone,
		email: string,
		password: Password,
		ranking: number,
		gender: Gender
		// address e cards
	) {
		this._name = name;
		this._birthDate = birthDate;
		this._cpf = cpf;
		this._telephone = telephone;
		this._email = email;
		this._password = password;
		this._ranking = ranking;
		this._gender = gender;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("clientName");
		}
		this._name = value;
	}

	get birthDate(): Date {
		return this._birthDate;
	}

	set birthDate(value: Date) {
		if (!value) {
			throw new MandatoryParameter("birthDate");
		}
		this._birthDate = value;
	}

	get cpf(): string {
		return this._cpf;
	}

	set cpf(value: string) {
		this._cpf = value;
	}

	get email(): string {
		return this._email;
	}

	set email(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("email");
		}
		const emailRegex: RegExp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
		if (!emailRegex.test(value)) {
			throw new InvalidEmailFormat(value);
		}
		this._email = value;
	}

	get password(): Password {
		return this._password;
	}

	set password(value: Password) {
		if (!value) {
			throw new MandatoryParameter("password");
		}
		this._password = value;
	}

	get ranking(): number {
		return this._ranking;
	}

	set ranking(value: number) {
		if (!value || isNaN(value)) {
			throw new MandatoryParameter("ranking");
		}
		this._ranking = value;
	}

	get telephone(): Telephone {
		return this._telephone;
	}

	set telephone(value: Telephone) {
		if (!value) {
			throw new MandatoryParameter("telephone");
		}
		this._telephone = value;
	}

	get gender(): Gender {
		return this._gender;
	}

	set gender(value: Gender) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("gender");
		}
		this._gender = value;
	}
}
