import {Column, Entity, JoinColumn, OneToMany, OneToOne} from "typeorm";
import Gender from "../domain/enums/Gender";
import AddressModel from "../../address/model/AddressModel";
import Card from "../../card/model/CreditCardModel";
import GenericModel from "../../generic/model/GenericModel";
import PasswordModel from "../../password/model/PasswordModel";
import TelephoneModel from "../../telephone/model/TelephoneModel";

@Entity()
export default class ClientModel extends GenericModel {
	@Column({ type: "varchar" })
	_name: string;

	@Column({type: "date"})
	_birthDate: Date;

	@Column({ type: "varchar" })
	_cpf: string;

	@Column({ type: "varchar" })
	_email: string;

	@OneToOne(() => PasswordModel)
	@JoinColumn()
	_password: PasswordModel;

	@Column({ type: "int" })
	_ranking: number;

	@Column(() => TelephoneModel)
	_telephone: TelephoneModel;

	@Column({ type: "enum", enum: Gender })
	_gender!: Gender;

	@OneToMany(() => Card, (card: Card) => card.client, {
		cascade: true,
		eager: true,
	})
	_cards!: Card[];

	@OneToMany(() => AddressModel, (address: AddressModel) => address.client, {
		cascade: true,
		eager: true,
	})
	_addresses!: AddressModel[];

	constructor(
		name: string,
		birthDate: Date,
		cpf: string,
		telephone: TelephoneModel,
		email: string,
		password: PasswordModel,
		ranking: number,
		gender: Gender
	) {
		super();
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
		this._name = value;
	}

	get birthDate(): Date {
		return this._birthDate;
	}

	set birthDate(value: Date) {
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
		this._email = value;
	}

	get password(): PasswordModel {
		return this._password;
	}

	set password(value: PasswordModel) {
		this._password = value;
	}

	get ranking(): number {
		return this._ranking;
	}

	set ranking(value: number) {
		this._ranking = value;
	}

	get telephone(): TelephoneModel {
		return this._telephone;
	}

	set telephone(value: TelephoneModel) {
		this._telephone = value;
	}

	get gender(): Gender {
		return this._gender;
	}

	set gender(value: Gender) {
		this._gender = value;
	}

	get cards(): Card[] {
		return this._cards;
	}

	set cards(value: Card[]) {
		this._cards = value;
	}

	get addresses(): AddressModel[] {
		return this._addresses;
	}

	set addresses(value: AddressModel[]) {
		this._addresses = value;
	}
}
