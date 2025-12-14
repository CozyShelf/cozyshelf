import { IUpdatePasswordTestData } from "../../support/pages/types/TestData";
import UpdatePasswordPageObject from "../../support/pages/client/UpdatePasswordPageObject";

describe("update password tests", () => {
	let updatePasswordPageObject: UpdatePasswordPageObject;

	const makeSUT = () => {
		updatePasswordPageObject = new UpdatePasswordPageObject();
	};

	beforeEach(() => {
		makeSUT();
	});

	it("should change password successfully", () => {
		cy.fixture("updatePassword").then((data: IUpdatePasswordTestData) => {
			updatePasswordPageObject.updatePassword(data);
			updatePasswordPageObject.verifyIfSuccessModalAppear();
			updatePasswordPageObject.closeSuccessModal();
		});
	});

	describe("validation tests", () => {
		it("should show validation error when current password doesn't match", () => {
			cy.fixture("updatePassword").then((data: IUpdatePasswordTestData) => {
				const invalidCurrentPassword = "Aaaa#12";
				const invalidPassword = {
					...data,
					currentPassword: invalidCurrentPassword,
				};

				updatePasswordPageObject.updatePassword(invalidPassword);
				updatePasswordPageObject.verifyIfErrorModalAppear(
					"Senha inválida ! A senha inserida não bate com a senha atual"
				);
				updatePasswordPageObject.closeErrorModal();
			});
		});

		it("should show validation error when new password is invalid", () => {
			cy.fixture("updatePassword").then((data: IUpdatePasswordTestData) => {
				const invalidNewPassword = "aaa";
				const invalidPassword = {
					...data,
					newPassword: invalidNewPassword,
					confirmNewPassword: invalidNewPassword
				};

				updatePasswordPageObject.updatePassword(invalidPassword);
				updatePasswordPageObject.verifyIfErrorModalAppear(
					"Senha inválida! A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas, números e caracteres especiais (@, #, $, %, etc.)."
				);
				updatePasswordPageObject.closeErrorModal();
			});
		});

		it("should show validation error when new password and its confirmation don't match", () => {
			cy.fixture("updatePassword").then((data: IUpdatePasswordTestData) => {
				const invalidConfirmation = "Aaaa#12";
				const invalidPassword = {
					...data,
					confirmNewPassword: invalidConfirmation,
				};

				updatePasswordPageObject.updatePassword(invalidPassword);
				updatePasswordPageObject.verifyIfInvalidConfirmationModalAppear();
				updatePasswordPageObject.closeInvalidConfirmationModal();
			});
		});

		it("should show validation error when new password equals current password", () => {
			cy.fixture("updatePassword").then((data: IUpdatePasswordTestData) => {
				const currentPassword = "ABCd#1234";
				const invalidPassword = {
					...data,
					currentPassword,
					newPassword: currentPassword,
				};

				updatePasswordPageObject.updatePassword(invalidPassword);
				updatePasswordPageObject.verifyIfInvalidNewPasswordModalAppear();
				updatePasswordPageObject.closeInvalidNewPasswordModal();
			});
		});
	});
});
