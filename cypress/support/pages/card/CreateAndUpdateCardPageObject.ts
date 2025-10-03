import GenericPage from "../GenericPageObject";
import { ICardTestData } from "../types/TestData";

export default class CreateAndUpdateCardPageObject extends GenericPage {
    private readonly CARD_CREATE_PAGE: string;
    private readonly CARD_UPDATE_PAGE: string;

    constructor() {
        super();
        this.CARD_CREATE_PAGE = "http://localhost:3000/cards/new";
        this.CARD_UPDATE_PAGE = "http://localhost:3000/cards/";
    }

    visitCardCreatePage() {
        this.visitPage(this.CARD_CREATE_PAGE);
    }

    visitCardUpdatePage(cardId: string) {
        this.visitPage(this.CARD_UPDATE_PAGE + cardId);
    }

    /* ========== Create Card Methods ========== */

    createNewCard(card: ICardTestData, preSendDataRule?: (...args: any) => void) {
        this.visitCardCreatePage();
        this.typeCardInformation(card);

        if (preSendDataRule) {
            preSendDataRule();
        }

        this.sendCardData();
    }

    typeCardInformation(card: ICardTestData) {
        this.typeInInput("card-number", card.number);
        this.typeInInput("card-cvv", card.cvv);
        this.typeInInput("card-impress-name", card.impressName);
        this.selectValue("card-flag", card.flag);
        this.toggleCheckbox("card-is-preferred", card.isPreferred);
    }

    sendCardData() {
        this.clickButton("newCard");
    }

    /* ========== Update Card Methods ========== */

    updateDataCard(cardUpdatedData: string, inputId: string) {
        this.clearAndTypeInInput(inputId, cardUpdatedData);
    }

    sendUpdateCardData() {
        this.clickButton("updateCard");
    }

    /* ========== Modals Verification Methods ========== */

    verifyIfSuccessModalAppear() {
        const successModal = this.getModalById("success-modal");
        successModal.should("exist");
    }

    verifyIfErrorModalAppear(message?: string) {
        const errorModal = this.getModalById("error-modal");
        errorModal.should("exist");
        if (message) {
            errorModal.should("contain", message);
        }
    }

    verifyIfInvalidNumberModalAppear(message?: string) {
        const invalidNumberModal = this.getModalById("invalid-number-modal");
        invalidNumberModal.should("exist");
        if (message) {
            invalidNumberModal.should("contain", message);
        }
    }
    
    verifyIfInvalidCvvModalAppear(message?: string) {
        const invalidCvvModal = this.getModalById("invalid-cvv-modal");
        invalidCvvModal.should("exist");
        if (message) {
            invalidCvvModal.should("contain", message);
        }
    }
    
    verifyIfInvalidNameModalAppear(message?: string) {
        const invalidNameModal = this.getModalById("invalid-name-modal");
        invalidNameModal.should("exist");
        if (message) {
            invalidNameModal.should("contain", message);
        }
    }

    verifyIfUpdateCardModalAppear() {
        const updateCardModal = this.getModalById("updated-successfully");
        updateCardModal.should("exist");
    }

    verifyIfUpdateErrorCardModalAppear(message?: string) {
        const updateErrorCardModal = this.getModalById("update-error-modal");
        updateErrorCardModal.should("exist");
        if (message) {
            updateErrorCardModal.should("contain", message);
        }
    }

    /* ========== Modals Close Methods ========== */
    closeSuccessModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("success-modal").click();
    }

    closeErrorModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("error-modal").click();
    }

    closeInvalidNumberModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("invalid-number-modal").click();
    }

    closeInvalidCvvModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("invalid-cvv-modal").click();
    }

    closeInvalidNameModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("invalid-name-modal").click();
    }

    closeUpdateCardModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("updated-successfully").click();
    }
    
    closeUpdateErrorCardModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("update-error-modal").click();
    }
}