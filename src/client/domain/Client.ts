import Gender from "./enums/Gender";
import InvalidEmailFormat from "./exceptions/InvalidEmailFormat";
import MandatoryParameter from "../../generic/domain/exceptions/MandatoryParameter";
import Password from "../../password/domain/Password";
import Telephone from "../../telephone/domain/Telephone";
import Address from "../../address/domain/Address";
import CreditCard from "../../card/domain/CreditCard";
import AddressType from "../../address/domain/enums/AddressType";
import InvalidAddressesProvided from "./exceptions/InvalidAddressesProvided";
import InvalidCardsProvided from "./exceptions/InvalidCardsProvided";
import INewClientInputData from "../types/INewClientRequestData";
import DomainEntity from "../../generic/domain/DomainEntity";
import IUpdateClientData from "../types/IUpdateClientData";
import InvalidCPFFormat from "./exceptions/InvalidCPFFormat";
import InvalidPreferredCardsProvided from "./exceptions/InvalidPreferredCardsProvided";
import CannotRemoveLastPreferredCard from "./exceptions/CannotRemoveLastPreferredCard";

export default class Client extends DomainEntity {
	_name!: string;
	_birthDate!: Date;
	_cpf!: string;
	_email!: string;
	_password!: Password;
	_ranking!: number;
	_telephone!: Telephone;
	_gender!: Gender;
	_addresses!: Address[];
	_cards!: CreditCard[];

	constructor(
		name: string,
		birthDate: Date,
		cpf: string,
		telephone: Telephone,
		email: string,
		password: Password,
		gender: Gender,
		addresses: Address[],
		cards: CreditCard[]
	) {
		super();
		this.name = name;
		this.birthDate = birthDate;
		this.cpf = cpf;
		this.telephone = telephone;
		this.email = email;
		this.password = password;
		this.gender = gender;
		this.addresses = addresses;
		this.cards = cards;
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
		const cpfRegex: RegExp = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
		if (!cpfRegex.test(value)) {
			throw new InvalidCPFFormat(value);
		}

		this._cpf = value;
	}

	get email(): string {
		return this._email;
	}

	set email(value: string) {
		if (!value || value.trim().length === 0) {
			throw new MandatoryParameter("email");
		}
		const emailRegex: RegExp =
			/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
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

	get addresses(): Address[] {
		return this._addresses;
	}

	set addresses(addresses: Address[]) {
		let billing = 0;
		let delivery = 0;

		addresses.forEach((address) => {
			if (address.type === AddressType.BILLING) {
				billing++;
			}
			if (address.type === AddressType.DELIVERY) {
				delivery++;
			}
			if (address.type === AddressType.DELIVERY_AND_BILLING) {
				billing++;
				delivery++;
			}
		});

		if (billing === 0) {
			throw new InvalidAddressesProvided(AddressType.BILLING);
		}

		if (delivery === 0) {
			throw new InvalidAddressesProvided(AddressType.DELIVERY);
		}

		this._addresses = addresses;
	}

	get cards(): CreditCard[] {
		return this._cards;
	}

	set cards(cards: CreditCard[]) {
		let preferred = 0;

		cards.forEach((card) => {
			if (card.isPreferred) {
				preferred++;
			}
		});

		if (preferred === 0) {
			throw new InvalidCardsProvided();
		}

		if (preferred > 1) {
			throw new InvalidPreferredCardsProvided();
		}

		this._cards = cards;
	}
	
	public verifyPreferredCards(newCard: CreditCard): void {
		if (newCard.isPreferred) {
			const hasPreferred = this._cards.some((card) => card.isPreferred);
			if (hasPreferred) {
				throw new InvalidPreferredCardsProvided();
			}
		}
	}

	public verifyCardUpdate(cardId: string, updatedCard: CreditCard): void {
		const simulatedCards = this._cards.map((card) => {
			if (card.id === cardId) {
				return updatedCard;
			}
			return card;
		});

		const hasPreferred = simulatedCards.some((card) => card.isPreferred);
		if (!hasPreferred) {
			throw new CannotRemoveLastPreferredCard();
		}

		const preferredCount = simulatedCards.filter(
			(card) => card.isPreferred
		).length;
		if (preferredCount > 1) {
			throw new InvalidPreferredCardsProvided();
		}
	}

	public static fromRequestData(requestData: INewClientInputData) {
		return new Client(
			requestData.clientData.name,
			requestData.clientData.birthDate,
			requestData.clientData.cpf,
			Telephone.fromRequestData(requestData.clientData.telephone),
			requestData.clientData.email,
			Password.fromRequestData(requestData.clientData.password),
			requestData.clientData.gender,
			requestData.addresses.map((addressData) =>
				Address.fromRequestData(addressData)
			),
			requestData.cards.map((cardData) => CreditCard.fromRequestData(cardData))
		);
	}

	public updateData(updatedData: IUpdateClientData) {
		if (updatedData.name) {
			this.name = updatedData.name;
		}
		if (updatedData.birthDate) {
			this.birthDate = updatedData.birthDate;
		}
		if (updatedData.cpf) {
			this.cpf = updatedData.cpf;
		}
		if (updatedData.email) {
			this.email = updatedData.email;
		}
		if (updatedData.gender) {
			this.gender = updatedData.gender;
		}
		if (updatedData.telephone) {
			this.telephone.updateData(updatedData.telephone);
		}
	}
}
