import ClientRegistrationPageObject from "../../support/pages/ClientRegistrationPageObject";
import { IClientTestData } from "../../support/pages/types/TestData";

describe("client registration", () => {
	let clientPageObject: ClientRegistrationPageObject;

	const makeSUT = () => {
		clientPageObject = new ClientRegistrationPageObject();
	};

	beforeEach(() => {
		makeSUT();
	});

	it("should correctly register a client", () => {
		cy.fixture("clientData").then((client: IClientTestData) => {
			clientPageObject.visitClientsPage();

			clientPageObject.typeClientInformation(client);
			clientPageObject.typeClientAddressInformation(client.address);
			clientPageObject.typeClientCardInformation(client.card);

			clientPageObject.sendClientData();

			clientPageObject.verifyIfSuccessModalAppear();

			clientPageObject.closeSuccessModal();
		});
	});

	describe("validation tests", () => {
		it("should show validation error for invalid CPF format", () => {
			cy.fixture("clientData").then((data: IClientTestData) => {
				const invalidCpf = "123";
				let invalidClient = { ...data, cpf: invalidCpf };

				clientPageObject.visitClientsPage();
				clientPageObject.typeClientInformation(invalidClient);
				clientPageObject.typeClientAddressInformation(invalidClient.address);
				clientPageObject.typeClientCardInformation(invalidClient.card);

				clientPageObject.sendClientData();

				clientPageObject.verifyIfErrorModalAppear(
					`CPF inválido! O CPF '${invalidCpf}' não é válido. Utilize o formato: 000.000.000-00.`
				);

				clientPageObject.closeErrorModal();
			});
		});

		it("should show validation error for invalid email format", () => {
			cy.fixture("clientData").then((data: IClientTestData) => {
				const invalidEmail = "invalidEmail";
				const invalidClient = { ...data, email: invalidEmail };

				clientPageObject.visitClientsPage();
				clientPageObject.typeClientInformation(invalidClient);
				clientPageObject.typeClientAddressInformation(invalidClient.address);
				clientPageObject.typeClientCardInformation(invalidClient.card);

				clientPageObject.changeEmailFieldTypeToText();

				clientPageObject.sendClientData();

				clientPageObject.verifyIfErrorModalAppear(
					`Email inválido! O email '${invalidEmail}' não possui um formato válido. Utilize o formato: exemplo@dominio.com`
				);
				clientPageObject.closeErrorModal();
			});
		});

		it("should show validation error for invalid CEP format", () => {
			cy.fixture("clientData").then((data: IClientTestData) => {
				const invalidCep = "000";
				data.address.cep = invalidCep;

				clientPageObject.visitClientsPage();
				clientPageObject.typeClientInformation(data);
				clientPageObject.typeClientAddressInformation(data.address);
				clientPageObject.typeClientCardInformation(data.card);

				clientPageObject.sendClientData();

				clientPageObject.verifyIfErrorModalAppear(
					`CEP inválido! O CEP '${invalidCep}' não é válido. Utilize o formato: 00000-000.`
				);

				clientPageObject.closeErrorModal();
			});
		});

		it("should validate password confirmation match", () => {
			cy.fixture("clientData").then((client: IClientTestData) => {
				const invalidRepeatPassword = "aaaaa";
				const invalidClient = {
					...client,
					repeatPassword: invalidRepeatPassword,
				};
				clientPageObject.visitClientsPage();

				clientPageObject.typeClientInformation(invalidClient);
				clientPageObject.typeClientAddressInformation(invalidClient.address);
				clientPageObject.typeClientCardInformation(invalidClient.card);

				clientPageObject.sendClientData();

				clientPageObject.verifyIfInvalidPasswordRepeatModalAppear();

				clientPageObject.closeInvalidPasswordRepeatModal();
			});
		});
	});

	describe("business rules tests", () => {
		it("should require at least one delivery address", () => {
			cy.fixture("clientData").then((client: IClientTestData) => {
				const modifiedClient = {
					...client,
					address: {
						...client.address,
						type: "BILLING",
					},
				};

				clientPageObject.visitClientsPage();
				clientPageObject.typeClientInformation(modifiedClient);
				clientPageObject.typeClientAddressInformation(modifiedClient.address);
				clientPageObject.typeClientCardInformation(modifiedClient.card);

				clientPageObject.sendClientData();

				clientPageObject.verifyIfErrorModalAppear(
					"É necessário o cadastro de ao menos um endereço de cobrança."
				);

				clientPageObject.closeErrorModal();
			});
		});

		it("should require at least one billing address", () => {
			cy.fixture("clientData").then((client: IClientTestData) => {
				const modifiedClient = {
					...client,
					address: {
						...client.address,
						type: "DELIVERY",
					},
				};

				clientPageObject.visitClientsPage();
				clientPageObject.typeClientInformation(modifiedClient);
				clientPageObject.typeClientAddressInformation(modifiedClient.address);
				clientPageObject.typeClientCardInformation(modifiedClient.card);

				clientPageObject.sendClientData();

				clientPageObject.verifyIfErrorModalAppear(
					"É necessário o cadastro de ao menos um endereço de entrega."
				);

				clientPageObject.closeErrorModal();
			});
		});

		it("should require exactly one preferred card", () => {
			cy.fixture("clientData").then((client: IClientTestData) => {
				const modifiedClient = {
					...client,
					card: {
						...client.card,
						isPreferred: false,
					},
				};

				clientPageObject.visitClientsPage();
				clientPageObject.typeClientInformation(modifiedClient);
				clientPageObject.typeClientAddressInformation(modifiedClient.address);
				clientPageObject.typeClientCardInformation(modifiedClient.card);

				clientPageObject.sendClientData();

				clientPageObject.verifyIfErrorModalAppear(
					"Cartão preferencial obrigatório! É necessário selecionar pelo menos um cartão como preferencial."
				);

				clientPageObject.closeErrorModal();
			});
		});
	});
});
