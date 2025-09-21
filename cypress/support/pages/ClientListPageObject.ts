import ClientRegistrationPageObject from "./ClientRegistrationPageObject";
import GenericPageObject from "./GenericPageObject";

export default class ClientListPageObject extends GenericPageObject {
	private readonly CLIENT_LIST_PAGE: string;

	constructor(
		private readonly registrationPageObject: ClientRegistrationPageObject
	) {
		super();
		this.CLIENT_LIST_PAGE = "http://localhost:3000/admin/clients";
	}

	registerNewAndListClients() {
		this.registerNewClients();
		this.visitClientListPage();
	}

	visitClientListPage() {
		this.visitPage(this.CLIENT_LIST_PAGE);
	}

	registerNewClients() {
		cy.fixture("additionalClients").then((clients) => {
			this.registrationPageObject.registerMultipleClients(clients);
		});
	}

	checkNumberOfClients(clientsNumber: number) {
		this.getTableRowsByPrefix("client").should("have.length", clientsNumber);
	}

	deleteOneClient(clientIndex: number) {
		this.clickAnchorById(`remove-client-${clientIndex}`);
		this.checkIfDeleteConfirmationModalAppear();
		this.confirmDeletion();
		this.checkIfDeleteSuccessModalAppear();
		this.closeDeleteSuccessModal();
	}

	deleteAllClients() {
		this.deleteOneClient(4);
		this.deleteOneClient(3);
		this.deleteOneClient(2);
		this.deleteOneClient(1);
	}

	checkIfNotFoundClientsAppear() {
		const notFoundDiv = cy.get("#not-found-clients");
		notFoundDiv.should("exist");
		notFoundDiv.should("be.visible");
		notFoundDiv.should("contain", "Nenhum cliente encontrado");
	}

	checkIfDeleteConfirmationModalAppear() {
		const confirmationModal = this.getModalById("delete-confimation");
		confirmationModal.should("exist");
		confirmationModal.should(
			"contain",
			"Esta ação irá deletar o cliente permanentemente."
		);
	}

	checkIfDeleteSuccessModalAppear() {
		const successModal = this.getModalById("delete-success");
		successModal.should("exist");
		successModal.should("contain", "Deletado com sucesso.");
	}

	confirmDeletion() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("delete-confimation").click();
	}

	closeDeleteSuccessModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("delete-success").click();
	}

	filterByName(name: string) {
		this.typeInInput("name-filter", name);
		cy.wait(2000);
	}

	filterByCPF(cpf: string) {
		this.typeInInput("cpf-filter", cpf);
		cy.wait(2000);
	}

	filterByEmail(email: string) {
		this.typeInInput("email-filter", email);
		cy.wait(2000);
	}

	filterByPhone(phone: string) {
		this.typeInInput("phone-filter", phone);
		cy.wait(2000);
	}
}
