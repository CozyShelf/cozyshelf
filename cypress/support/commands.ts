/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		getById(id: string): any;
		checkSuccessModal(message: string): any;
		defaultConfiguration(): any;
		toggleCheckbox(id: string, shouldCheck: boolean): any;
		clickToggle(id: string): any;
	}
}

// @ts-ignore
Cypress.Commands.add("getById", (id: string) => {
	return cy.get(`#${id}`);
});

// @ts-ignore
Cypress.Commands.add("checkSuccessModal", (message: string) => {
	cy.get("#success-modal").should("be.visible");
	cy.get("#success-modal").should("contain", message);
	return cy.get("#success-modal .swal2-confirm");
});

// @ts-ignore
Cypress.Commands.add("defaultConfiguration", () => {
	return cy.viewport(1920, 1080);
});

// @ts-ignore
Cypress.Commands.add("toggleCheckbox", (id: string, shouldCheck: boolean) => {
	cy.getById(id).then(($checkbox: any) => {
		if ($checkbox.is(":checked") !== shouldCheck) {
			cy.getById(id).check({ force: true });
		}
	});
});
