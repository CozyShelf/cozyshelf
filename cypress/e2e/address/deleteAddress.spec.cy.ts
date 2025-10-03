import AddressTablePageObject from "../../support/pages/address/AddressTablePageObject";
import CreateAndUpdateAddressPageObject from "../../support/pages/address/CreateAndUpdateAddressPageObject";

describe("delete an address", () => {
    let addressTablePageObject : AddressTablePageObject;
    let addressPageObject : CreateAndUpdateAddressPageObject;

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
    });

    it("should show a warning modal when trying to delete the only delivery and billing address", () => {
        makeSUT();
        addressTablePageObject.deleteAddressErrorTypeAddress(0);

        addressTablePageObject.verifyIfDeleteConfirmationModalAppear();
        addressTablePageObject.closeDeleteConfirmationModal();

        addressTablePageObject.verifyIfDeleteErrorModalAppear("É necessário o cadastro de ao menos um endereço de cobrança.");
        addressTablePageObject.closeDeleteErrorModal();
    });

    it("should delete a non-preferred card successfully", () => {
        makeSUT();
        addressTablePageObject.deleteAddressSuccess(1);

        addressTablePageObject.verifyIfDeleteConfirmationModalAppear();
        addressTablePageObject.closeDeleteConfirmationModal();

        addressTablePageObject.verifyIfSuccessModalAppear();
        addressTablePageObject.closeSuccessModal();
    });
});