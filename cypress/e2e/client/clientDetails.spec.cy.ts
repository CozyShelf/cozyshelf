import ClientDetailsPageObject from "../../support/pages/ClientDetailsPageObject";
import ClientRegistrationPageObject from "../../support/pages/ClientRegistrationPageObject";

describe("client details tests", () => {
	let clientDetailsPageObject: ClientDetailsPageObject;

	const makeSUT = () => {
		clientDetailsPageObject = new ClientDetailsPageObject();
	};

	beforeEach(() => {
		makeSUT();
	});

	it("should correctly list client details", () => {
		cy.fixture("alreadyRegisteredClient").then((client) => {
			clientDetailsPageObject.visitClientDetailsPage();

			clientDetailsPageObject.verifyClientInformation(client);
			clientDetailsPageObject.verifyAddressInformation(client.address);
			clientDetailsPageObject.verifyCardInformation(client.card);
		});
	});
});
