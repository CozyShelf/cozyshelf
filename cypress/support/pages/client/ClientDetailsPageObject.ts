import GenericPageObject from "../GenericPageObject";
import {
	IAddressTestData,
	ICardTestData,
	IClientTestData,
} from "../types/TestData";

export default class ClientDetailsPageObject extends GenericPageObject {
	private readonly CLIENT_DETAILS_PAGE: string;

	constructor() {
		super();
		this.CLIENT_DETAILS_PAGE = `http://localhost:3000/admin/clients/${this.ALREADY_REGISTERED_CLIENT_ID}`;
	}

	visitClientDetailsPage() {
		this.visitPage(this.CLIENT_DETAILS_PAGE);
	}

	verifyClientInformation(client: IClientTestData) {
		this.verifyInputValue(`client-name`, client.name);
		this.verifyInputValueWithoutMask("client-cpf", client.cpf);
		this.verifyInputValue("client-gender", client.gender);
		this.verifyInputValue("client-birth-date", client.birthDate);
		this.verifyInputValueWithoutMask("client-phone", client.phone);
		this.verifyInputValue("client-phone-type", client.phoneType);
		this.verifyInputValue("client-email", client.email);
	}

	verifyAddressInformation(address: IAddressTestData) {
		this.verifyInputValue("address-short-phrase", address.shortPhrase);
		this.verifyInputValueWithoutMask("address-zip-code", address.cep);
		this.verifySelectValue("address-state", address.state);
		this.verifyInputValue("address-city", address.city);
		this.verifySelectValue("address-street-type", address.streetType);
		this.verifyInputValue("address-street-name", address.streetName);
		this.verifyInputValue("address-number", address.number);
		this.verifyInputValue("address-neighborhood", address.neighborhood);
		this.verifySelectValue("address-residence-type", address.residenceType);
		this.verifySelectValue("address-type", address.type);
	}

	verifyCardInformation(card: ICardTestData) {
		this.verifyInputValueWithoutMask("card-number", card.number);
		this.verifyInputValue("card-cvv", card.cvv);
		this.verifyInputValue("card-impress-name", card.impressName);
		this.verifySelectValue("card-flag", card.flag);
		cy.get("#card-is-preferred").should(
			card.isPreferred ? "be.checked" : "not.be.checked"
		);
	}
}
