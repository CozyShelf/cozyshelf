describe("client registration", () => {
	it("should register a client", () => {
		cy.fixture("clientData").then((client: any) => {
			cy.defaultConfiguration();

			cy.visit("http://localhost:3000/clients/register");

			cy.getById("client-name").type(client.name);
			cy.getById("client-birth-date").type(client.birthDate);
			cy.getById("client-email").type(client.email);
			cy.getById("client-cpf").type(client.cpf);
			cy.getById("client-phone").type(client.phone);
			cy.getById("client-password").type(client.password);
			cy.getById("client-gender").select(client.gender);
			cy.getById("client-phone-type").select(client.phoneType);
			cy.getById("client-password-repeat").type(client.password);

			cy.getById("address-short-phrase").type(client.address.shortPhrase);
			cy.getById("address-cep").type(client.address.cep);
			cy.getById("address-state").select(client.address.state);
			cy.getById("address-city").type(client.address.city);
			cy.getById("address-street-type").select(client.address.streetType);
			cy.getById("address-street-name").type(client.address.streetName);
			cy.getById("address-number").type(client.address.number);
			cy.getById("address-neighborhood").type(client.address.neighborhood);
			cy.getById("address-residence-type").select(client.address.residenceType);
			cy.getById("address-type").select(client.address.type);

			cy.getById("card-number").type(client.card.number);
			cy.getById("card-cvv").type(client.card.cvv);
			cy.getById("card-impress-name").type(client.card.impressName);
			cy.getById("card-flag").select(client.card.flag);

			cy.toggleCheckbox("card-is-preferred", client.card.isPreferred);

			cy.contains("button", "Enviar").click();

			cy.checkSuccessModal("Dados enviados com sucesso").click();
		});
	});
});
