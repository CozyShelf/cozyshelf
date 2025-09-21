import AddressTablePageObject from "../../support/pages/address/AddressTablePageObject";
import CreateAndUpdateAddressPageObject from "../../support/pages/address/CreateAndUpdateAddressPageObject";
import { IAddressTestData } from "../../support/pages/types/TestData";

describe("update an address", () => {
    let addressTablePageObject: AddressTablePageObject;
    let addressPageObject: CreateAndUpdateAddressPageObject;

    const makeSUT = () => {
        addressTablePageObject = new AddressTablePageObject();
        addressPageObject = new CreateAndUpdateAddressPageObject();
    };

    // @ts-ignore - Cypress type issue
    before(() => {
        makeSUT();
        addressPageObject.visitAddressCreatePage();
        cy.fixture("addressData").then((address) => {
            addressPageObject.createNewAddress(address);
            addressPageObject.verifyIfSuccessModalAppear();
            addressPageObject.closeSuccessModal();
        });
    });

    beforeEach(() => {
        makeSUT();
        addressTablePageObject.visitAddressTablePage();
    });

    it("should correctly update an address", () => {
        addressTablePageObject.clickInDetailButton(0);
        cy.fixture("addressData").then((updatedAddress: IAddressTestData) => {

            const addressWithNewNumber = { ...updatedAddress, number: "456" };

            addressPageObject.updateAddress(addressWithNewNumber);

            addressPageObject.verifyIfUpdateAddressModalAppear();
            addressPageObject.closeUpdateSuccessAddressModal();
        });
    });

    it("should show an error modal when trying to update an address with invalid CEP", () => {
        addressTablePageObject.clickInDetailButton(0);
        cy.fixture("addressData").then((updatedAddress: IAddressTestData) => {

        const addressWithNewNumber = { ...updatedAddress, cep: "456" };

            addressPageObject.updateAddress(addressWithNewNumber);

            addressPageObject.verifyIfInvalidZipCodeModalAppear("Por favor, insira um CEP válido no formato XXXXX-XXX.");
            addressPageObject.closeInvalidZipCodeModal();
        });
    });
});