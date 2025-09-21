export default abstract class GenericPageObject {
	protected visitPage(url: string) {
		cy.visit(url);
	}

	protected typeInInput(inputId: string, content: any) {
		cy.get(`#${inputId}`).type(content);
	}

	protected clearAndTypeInInput(inputId: string, value: string) {
        this.getInputById(inputId).clear()
        this.typeInInput(inputId, value);
    }

	protected getInputById(inputId: string) {
		return cy.get(`#${inputId}`);
	}

	protected selectValue(selectId: string, value: any) {
		cy.get(`#${selectId}`).select(value);
	}

	protected clickButton(buttonId: string) {
		cy.get(`#${buttonId}`).click();
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
}
