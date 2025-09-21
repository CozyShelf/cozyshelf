import ClientListPageObject from "../../support/pages/ClientListPageObject";
import ClientRegistrationPageObject from "../../support/pages/ClientRegistrationPageObject";

describe("client listing tests", () => {
	let clientListPageObject: ClientListPageObject;

	const makeSUT = () => {
		clientListPageObject = new ClientListPageObject(
			new ClientRegistrationPageObject()
		);
	};

	beforeEach(() => {
		makeSUT();
	});

	it("should have the right amount of clients after new registrations", () => {
		clientListPageObject.registerNewAndListClients();
		clientListPageObject.checkNumberOfClients(5);
	});

	it("should correctly delete a client from the list", () => {
		clientListPageObject.visitClientListPage();

		clientListPageObject.deleteOneClient(5);

		clientListPageObject.checkNumberOfClients(4);
	});

	it("should correctly show not found clients message if no clients is registered", () => {
		clientListPageObject.visitClientListPage();

		clientListPageObject.deleteAllClients();

		clientListPageObject.checkIfNotFoundClientsAppear();
	});

	describe("filter tests", () => {
		// @ts-ignore - Cypress type issue
		before(() => {
			clientListPageObject.registerNewClients();
		});

		it("should correctly filter client by name", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByName("Maria");

			clientListPageObject.checkNumberOfClients(1);
		});

		it("should correctly filter client by cpf", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByCPF("321.654.987-12");

			clientListPageObject.checkNumberOfClients(1);
		});

		it("should correctly filter client by email", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByEmail("ana.paula@email.com");

			clientListPageObject.checkNumberOfClients(1);
		});

		it("should correctly filter client by phone", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByPhone("955555555");

			clientListPageObject.checkNumberOfClients(1);
		});

		it("should correctly filter client by surname", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByName("Henrique");

			clientListPageObject.checkNumberOfClients(1);
		});

		it("should correctly filter client by filter combination", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByName("Henrique");
			clientListPageObject.filterByEmail("pedro.henrique@email.com");

			clientListPageObject.checkNumberOfClients(1);
		});

		it("should show not found message if an incorrect filter combination is provided", () => {
			clientListPageObject.visitClientListPage();

			clientListPageObject.filterByName("Pedro");
			clientListPageObject.filterByPhone("966666666");

			clientListPageObject.checkNumberOfClients(0);
			clientListPageObject.checkIfNotFoundClientsAppear();
		});
	});
});
