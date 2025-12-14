/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		defaultConfiguration(): any;
	}
}

// @ts-ignore
Cypress.Commands.add("defaultConfiguration", () => {
	return cy.viewport(1920, 1080);
});
