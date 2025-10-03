import GenericPageObject from "./GenericPageObject";
import { IUpdatePasswordTestData } from "./types/TestData";

export default class UpdatePasswordPageObject extends GenericPageObject {
	private readonly UPDATE_PASSWORD_PAGE: string;

	constructor() {
		super();
		this.UPDATE_PASSWORD_PAGE = `http://localhost:3000/clients/${this.ALREADY_REGISTERED_CLIENT_ID}/password`;
	}

	visitUpdatePasswordPage() {
		this.visitPage(this.UPDATE_PASSWORD_PAGE);
	}

	updatePassword(password: IUpdatePasswordTestData) {
		this.visitUpdatePasswordPage();
		this.typeCurrentPassword(password.currentPassword);
		this.typeNewPassword(password.newPassword);
		this.typePasswordConfirmation(password.confirmNewPassword);
		this.sendUpdatePasswordData();
	}

	typeCurrentPassword(currentPassword: string) {
		this.typeInInput("current-password", currentPassword);
	}

	typeNewPassword(newPassword: string) {
		this.typeInInput("new-password", newPassword);
	}

	typePasswordConfirmation(passwordConfirmation: string) {
		this.typeInInput("confirm-new-password", passwordConfirmation);
	}

	sendUpdatePasswordData() {
		this.clickButton("submit-update-password");
	}

	verifyIfSuccessModalAppear() {
		const successModal = this.getModalById("updated-successfully");
		successModal.should("exist");
		successModal.should("contain", "Atualizado com sucesso!");
	}

	verifyIfInvalidConfirmationModalAppear() {
		const successModal = this.getModalById("invalid-password-confirmation");
		successModal.should("exist");
		successModal.should(
			"contain",
			"A nova senha e a confirmação devem ser iguais."
		);
	}

	verifyIfInvalidNewPasswordModalAppear() {
		const successModal = this.getModalById("invalid-new-password");
		successModal.should("exist");
		successModal.should(
			"contain",
			"A nova senha deve ser diferente da senha atual."
		);
	}

	verifyIfErrorModalAppear(message?: string) {
		const errorModal = this.getModalById("update-error");
		errorModal.should("exist");
		if (message) {
			errorModal.should("contain", message);
		}
	}

	closeSuccessModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("updated-successfully").click();
	}

	closeInvalidConfirmationModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId(
			"invalid-password-confirmation"
		).click();
	}

	closeInvalidNewPasswordModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("invalid-new-password").click();
	}

	closeErrorModal() {
		cy.wait(1000);
		this.getModalConfirmButtonByModalId("update-error").click();
	}
}
