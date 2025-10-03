import GenericPageObject from "../GenericPageObject";

export default class CardTablePageObject extends GenericPageObject {
    private readonly CARD_TABLE_PAGE: string;

    constructor() {
        super();
        this.CARD_TABLE_PAGE = "http://localhost:3000/cards/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";
    }
    
    visitCardTablePage() {
        this.visitPage(this.CARD_TABLE_PAGE);
    }

    verifyCardInTable(cardRow: number) {
        this.visitCardTablePage();
        this.getCardRow(cardRow).should("exist");
    }

    getCardRow(cardRow: number) {
        return cy.get("table tbody tr").eq(cardRow);
    }

    getDetailButton(cardRow: number) {
        return this.getCardRow(cardRow).find('a.detail-btn');
    }

    clickInDetailButton(cardRow: number) {
        this.getDetailButton(cardRow).click();
    }

    /* ========== Card Deletion Methods ========== */

    getDeleteButton(cardRow: number) {
        return this.getCardRow(cardRow).find('a.delete-btn');
    }

    clickInDeleteButton(cardRow: number) {
        this.getDeleteButton(cardRow).click();
    }

    // alterar o cardRow para receber o id do cartao
    verifyIfCardIsDeleted(cardRow: number) {
        this.getCardRow(cardRow).should("not.exist");
    }

    deleteCardSucess(cardRow: number) {
        this.visitCardTablePage();
        this.clickInDeleteButton(cardRow);
    }

    deleteCardErrorPreferredCard(cardRow: number) {
        this.visitCardTablePage();
        this.clickInDeleteButton(cardRow);
    }

    /* ========== Modals Verification Methods ========== */

    verifyIfErrorModalAppear(message?: string) {
        const errorModal = this.getModalById("error-modal");
        errorModal.should("exist");
        if (message) {
            errorModal.should("contain", message);
        }
    }

    verifyIfWarningPreferredCardModalAppear(message?: string) {
        const warningModal = this.getModalById("preferred-card-warning-modal");
        warningModal.should("exist");
        if (message) {
            warningModal.should("contain", message);
        }
    }

    verifyIfDeleteConfirmationModalAppear(message?: string) {
        const confirmationModal = this.getModalById("delete-confimation");
        confirmationModal.should("exist");
        if (message) {
            confirmationModal.should("contain", message);
        }
    }

    verifyIfSuccessModalAppear() {
        const successModal = this.getModalById("delete-success");
        successModal.should("exist");
    }

    /* ========== Modals Close Methods ========== */

    closeSuccessModal() {
        this.getModalConfirmButtonByModalId("delete-success").click();
    }

    closeErrorModal() {
        this.getModalConfirmButtonByModalId("error-modal").click();
    }
    
    closeDeleteConfirmationModal() {
        this.getModalConfirmButtonByModalId("delete-confimation").click();
    }

    closeWarningPreferredCardModal() {
        this.getModalConfirmButtonByModalId("preferred-card-warning-modal").click();
    }
}