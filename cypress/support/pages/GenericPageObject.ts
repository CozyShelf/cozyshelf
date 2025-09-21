export default abstract class GenericPageObject {
	protected readonly ALREADY_REGISTERED_CLIENT_ID: string =
		"f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";

	protected visitPage(url: string) {
		cy.visit(url);
	}

	protected typeInInput(inputId: string, content: any) {
		cy.get(`#${inputId}`).type(content);
	}

	protected selectValue(selectId: string, value: any) {
		cy.get(`#${selectId}`).select(value);
	}

	protected clickButton(buttonId: string) {
		cy.get(`#${buttonId}`).click();
	}

	protected clickAnchorById(anchorId: string) {
		cy.get(`a#${anchorId}`).click();
	}

	protected toggleCheckbox(checkboxId: string, shouldCheck: boolean) {
		cy.get(`#${checkboxId}`).then(($checkbox: any) => {
			if ($checkbox.is(":checked") !== shouldCheck) {
				cy.get(`#${checkboxId}`).check({ force: true });
			}
		});
	}

	protected getModalById(modalId: string) {
		return cy.get(`#${modalId}`);
	}

	protected getModalConfirmButtonByModalId(modalId: string) {
		return cy.get(`#${modalId} .swal2-confirm`);
	}

	protected changeInputTypeTemporarily(inputId: string, newType: string) {
		cy.get(`#${inputId}`).invoke("attr", "type", newType);
	}

	protected getTableRowsById(trId?: string) {
		return cy.get(`tr#${trId}`);
	}

	protected getTableRowsByPrefix(prefix: string) {
		return cy.get(`tr[id^="${prefix}-"]`) || cy.get(`tr[id^="-${prefix}"]`);
	}

	protected getAnchorsByPrefix(prefix: string) {
		return cy.get(`a[id^="${prefix}-"]`) || cy.get(`a[id^="-${prefix}"]`);
	}

	protected verifyInputValue(inputId: string, value: any) {
		cy.get(`#${inputId}`).should("have.value", value);
	}

	protected verifyInputValueWithoutMask(
		inputId: string,
		expectedValue: string
	) {
		cy.get(`#${inputId}`)
			.invoke("val")
			.then((inputValue) => {
				const cleanedValue = this.removeFormatting(inputValue);
				// @ts-ignore - Cypress type issue
				expect(cleanedValue).to.equal(expectedValue);
			});
	}

	protected verifySelectValue(selectId: string, expectedValue: any) {
		cy.get(`#${selectId}`).should("have.value", expectedValue);
	}

	private removeFormatting(value: string): string {
		return value.replace(/[^a-zA-Z0-9]/g, "");
	}
}
