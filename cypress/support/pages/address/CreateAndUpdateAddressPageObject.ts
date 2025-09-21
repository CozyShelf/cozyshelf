import GenericPageObject from "../GenericPageObject";
import { IAddressTestData } from "../types/TestData";

export default class CreateAndUpdateAddressPageObject extends GenericPageObject {
    private readonly ADDRESS_CREATE_PAGE: string;
    private readonly ADDRESS_UPDATE_PAGE: string;

    constructor() {
        super();
        this.ADDRESS_CREATE_PAGE = "http://localhost:3000/addresses/register";
        this.ADDRESS_UPDATE_PAGE = "http://localhost:3000/addresses";
    }

    visitAddressCreatePage() {
        this.visitPage(this.ADDRESS_CREATE_PAGE);
    }

    visitAddressUpdatePage(addressId: string) {
        this.visitPage(`${this.ADDRESS_UPDATE_PAGE}/${addressId}`);
    }


    /* ========== Create Address Methods ========== */

    createNewAddress(address: IAddressTestData, preSendDataRule?: (...args: any) => void) {
        this.visitAddressCreatePage();
        this.typeAddressInformation(address);

        if (preSendDataRule) {
            preSendDataRule();
        }

        this.sendAddressData();
    }

    typeAddressInformation(address: IAddressTestData) {
        this.typeInInput("address-zip-code", address.cep);
        cy.wait(2000); // wait for the address auto-fill based on the zip code
        this.typeInInput("address-number", address.number);
        this.typeInInput("address-street-name", address.streetName);
        this.typeInInput("address-neighborhood", address.neighborhood);
        this.typeInInput("address-city", address.city);
        this.typeInInput("address-short-phrase", address.shortPhrase);

        if (address.observation) {
            this.typeInInput("address-observation", address.observation);
        }
        
        this.selectValue("address-residence-type", address.residenceType);
        this.selectValue("address-street-type", address.streetType);
        this.selectValue("address-state", address.state);
        this.selectValue("address-type", address.type);
    }

    sendAddressData() {
        this.clickButton("newAddress");
    }

    /* ========== Update Address Methods ========== */

    updateAddress( address: IAddressTestData) {
        this.clearAndTypeAddressInformation(address);
        this.sendUpdateAddressData();
    }

    clearAndTypeAddressInformation(address: IAddressTestData) {
        this.clearAndTypeInInput("address-zip-code", address.cep);
        this.clearAndTypeInInput("address-number", address.number);
        this.clearAndTypeInInput("address-street-name", address.streetName);
        this.clearAndTypeInInput("address-neighborhood", address.neighborhood);
        this.clearAndTypeInInput("address-short-phrase", address.shortPhrase);
        this.clearAndTypeInInput("address-city", address.city);
        
        if (address.observation) {
            this.clearAndTypeInInput("address-observation", address.observation);
        }
        
        this.selectValue("address-residence-type", address.residenceType);
        this.selectValue("address-street-type", address.streetType);
        this.selectValue("address-type", address.type);
        this.selectValue("address-state", address.state);
    }

    sendUpdateAddressData() {
        cy.wait(1000);
        this.clickButton("updateAddress");
    }

    /* ========== Validation Methods ========== */

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

    verifyIfInvalidZipCodeModalAppear(message?: string) {
        const invalidZipCodeModal = this.getModalById("invalid-zip-code-modal");
        invalidZipCodeModal.should("exist");
        if (message) {
            invalidZipCodeModal.should("contain", message);
        }
    }

    verifyIfUpdateCardModalAppear() {
        const updateCardModal = this.getModalById("updated-successfully");
        updateCardModal.should("exist");
    }

    verifyIfUpdateAddressModalAppear() {
        const updateCardModal = this.getModalById("updated-successfully");
        updateCardModal.should("exist");
    }

    verifyIfUpdateErrorAddressModalAppear(message?: string) {
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

    closeInvalidZipCodeModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("invalid-zip-code-modal").click();
    }

    closeUpdateSuccessAddressModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("updated-successfully").click();
    }
    
    closeUpdateErrorAddressModal() {
        cy.wait(1000);
        this.getModalConfirmButtonByModalId("update-error-modal").click();
    }

    /* ========== Other Methods ========== */
    checkIfZipCodeFilledAutomatically(expectedZipCode: string) {
        this.getInputById("address-zip-code").should("have.value", expectedZipCode);
        this.getInputById("address-city").should("have.value").and("not.be.empty");
        this.getInputById("address-neighborhood").should("have.value").and("not.be.empty");
        this.getInputById("address-street-name").should("have.value").and("not.be.empty");
    }
}