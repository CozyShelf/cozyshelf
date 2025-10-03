import GenericPage from "./GenericPageObject";
import {
	IAddressTestData,
	ICardTestData,
	IClientTestData,
} from "./types/TestData";

export default class ClientRegistrationPageObject extends GenericPage {
	private readonly CLIENT_REGISTER_PAGE: string;

	constructor() {
		super();
		this.CLIENT_REGISTER_PAGE = "http://localhost:3000/clients/register";
	}

	visitClientsPage() {
		this.visitPage(this.CLIENT_REGISTER_PAGE);
	}

	registerNewClient(client: IClientTestData, preSendDataRule?: (...args: any) => void) {
		this.visitClientsPage();
		this.typeClientInformation(client);
		this.typeClientAddressInformation(client.address);
		this.typeClientCardInformation(client.card);

		if (preSendDataRule) {
			preSendDataRule();
		}

		this.sendClientData();
	}

	registerMultipleClients(clients: IClientTestData[]) {
		clients.forEach((client) => {
			cy.then(() => {
				this.registerNewClient(client);
				this.verifyIfSuccessModalAppear();
				this.closeSuccessModal();
			});
		});
	}

	typeClientInformation(client: IClientTestData) {
		this.typeInInput("client-name", client.name);
		this.typeInInput("client-birth-date", client.birthDate);
		this.typeInInput("client-email", client.email);
		this.typeInInput("client-cpf", client.cpf);
		this.typeInInput("client-phone", `${client.phone}`);
		this.typeInInput("client-password", client.password);
		this.typeInInput(
			"client-password-repeat",
			client.repeatPassword || client.password
		);
		this.selectValue("client-gender", client.gender);
		this.selectValue("client-phone-type", client.phoneType);
	}

	typeClientAddressInformation(address: IAddressTestData) {
		this.typeInInput("address-short-phrase", address.shortPhrase);
		this.typeInInput("address-cep", address.cep);
		this.selectValue("address-state", address.state);
		this.typeInInput("address-city", address.city);
		this.selectValue("address-street-type", address.streetType);
		this.typeInInput("address-street-name", address.streetName);
		this.typeInInput("address-number", address.number);
		this.typeInInput("address-neighborhood", address.neighborhood);
		this.selectValue("address-residence-type", address.residenceType);
		this.selectValue("address-type", address.type);
	}

	typeClientCardInformation(card: ICardTestData) {
		this.typeInInput("card-number", card.number);
		this.typeInInput("card-cvv", card.cvv);
		this.typeInInput("card-impress-name", card.impressName);
		this.selectValue("card-flag", card.flag);
		this.toggleCheckbox("card-is-preferred", card.isPreferred);
	}

	typeInvalidDate(invalidDate: string) {
		this.typeInInput("client-birth-date", invalidDate);
	}

	sendClientData() {
		this.clickButton("send-client-info");
	}

	verifyIfSuccessModalAppear() {
		const successModal = this.getModalById("success-modal");
		successModal.should("exist");
	}

	verifyIfErrorModalAppear(message?: string) {
		const errorModal = this.getModalById("error-modal");
		errorModal.should("exist");
		if (message) {
			errorModal.should("contain", message);
		}
	}

	verifyIfInvalidPasswordRepeatModalAppear() {
		const invalidPassRepeat = this.getModalById(
			"invalid-password-repeat-modal"
		);
		invalidPassRepeat.should("exist");
		invalidPassRepeat.should(
			"contain",
			"Por favor, verifique se as senhas são iguais."
		);
	}

	verifyIfInvalidAgeModalAppear() {
		const invalidAge = this.getModalById("invalid-age");
		invalidAge.should("exist");
		invalidAge.should(
			"contain",
			"Você deve ter pelo menos 18 anos para se cadastrar."
		);
	}

	closeSuccessModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("success-modal").click();
	}

	closeErrorModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("error-modal").click();
	}

	closeInvalidPasswordRepeatModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId(
			"invalid-password-repeat-modal"
		).click();
	}

	closeInvalidAgeModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("invalid-age").click();
	}

	changeEmailFieldTypeToText() {
		this.changeInputTypeTemporarily("client-email", "text");
	}
}
