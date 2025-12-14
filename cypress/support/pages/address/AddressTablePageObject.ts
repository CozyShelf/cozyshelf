import GenericPageObject from "../GenericPageObject";

export default class AddressTablePageObject extends GenericPageObject {
    private readonly ADDRESS_TABLE_PAGE: string;

    constructor() {
        super();
        this.ADDRESS_TABLE_PAGE = "http://localhost:3000/addresses/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";
    }
    
    visitAddressTablePage() {
        this.visitPage(this.ADDRESS_TABLE_PAGE);
    }

    verifyAddressInTable(addressRow: number) {
        this.visitAddressTablePage();
        this.getAddressRow(addressRow).should("exist");
    }

    getAddressRow(addressRow: number) {
        return cy.get("table tbody tr").eq(addressRow);
    }

    getDetailButton(addressRow: number) {
        return this.getAddressRow(addressRow).find('a[href*="/addresses/"]').first();
    }

    clickInDetailButton(addressRow: number) {
        this.getDetailButton(addressRow).click();
    }

    getAddButton() {
        return cy.get('a[href="/addresses/register"]');
    }

    clickAddButton() {
        this.getAddButton().click();
    }

    /* ========== Address Deletion Methods ========== */

    getDeleteButton(addressRow: number) {
        return this.getAddressRow(addressRow).find('a.delete-btn');
    }

    clickInDeleteButton(addressRow: number) {
        this.getDeleteButton(addressRow).click();
    }

    deleteAddressSuccess(addressRow: number) {
        this.visitAddressTablePage();
        cy.wait(1000);
        this.clickInDeleteButton(addressRow);
    }

    deleteAddressErrorTypeAddress(addressRow: number) {
        this.visitAddressTablePage();
        this.clickInDeleteButton(addressRow);
    }

    /* ========== Address Verification Methods ========== */

    getAddressByShortPhrase(shortPhrase: string) {
        return cy.get("table tbody tr").contains("td", shortPhrase).parent("tr");
    }

    assertAddressExists(shortPhrase: string) {
        cy.get("table tbody tr")
            .contains("td", shortPhrase)
            .should("exist");
    }

    assertAddressNotExists(shortPhrase: string) {
        cy.get("table tbody tr")
            .contains("td", shortPhrase)
            .should("not.exist");
    }

    assertAddressType(shortPhrase: string, expectedType: string) {
        this.getAddressByShortPhrase(shortPhrase)
            .find("td span")
            .should("contain", expectedType);
    }

    assertTableHasAddresses() {
        cy.get("table tbody tr").should("have.length.greaterThan", 0);
    }

    assertTableIsEmpty() {
        cy.get("table tbody tr").should("have.length", 0);
    }

    getAddressCount() {
        return cy.get("h1").invoke("text").then((text) => {
            const match = text.match(/\((\d+)\)/);
            return match ? parseInt(match[1]) : 0;
        });
    }

    assertAddressCount(expectedCount: number) {
        cy.get("h1").should("contain", `(${expectedCount})`);
    }

    /* ========== Modals Verification Methods ========== */

    verifyIfErrorModalAppear(message?: string) {
        const errorModal = this.getModalById("error-modal");
        errorModal.should("exist");
        if (message) {
            errorModal.should("contain", message);
        }
    }

    verifyIfDeleteConfirmationModalAppear(message?: string) {
        const confirmationModal = this.getModalById("delete-confimation");
        confirmationModal.should("exist");
        if (message) {
            confirmationModal.should("contain", message);
        }
    }

    verifyIfDeleteErrorModalAppear(message?: string) {
        const deleteErrorModal = this.getModalById("delete-error-modal");
        deleteErrorModal.should("exist");
        if (message) {
            deleteErrorModal.should("contain", message);
        }
    }
    verifyIfSuccessModalAppear() {
        const successModal = this.getModalById("delete-success");
        successModal.should("exist");
    }

    confirmDeleteModal() {
        cy.contains("Sim, inativar!").click();
    }

    cancelDeleteModal() {
        cy.contains("Cancelar").click();
    }

    verifyDeleteConfirmationModal() {
        cy.contains("Você tem certeza?", { timeout: 10000 }).should("be.visible");
        cy.contains("Esta ação irá inativar o endereço permanentemente.").should("be.visible");
    }

    verifySuccessDeleteModal() {
        cy.get("#delete-success", { timeout: 10000 })
            .should("exist")
            .should("contain", "Endereço inativado!");
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

    closeDeleteErrorModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("delete-error-modal").click();
    }
}