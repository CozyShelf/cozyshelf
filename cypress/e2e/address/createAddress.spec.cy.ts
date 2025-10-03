import CreateAndUpdateAddressPageObject from "../../support/pages/address/CreateAndUpdateAddressPageObject";
import { IAddressTestData } from "../../support/pages/types/TestData";

describe("add new address", () => {
    let addressPageObject: CreateAndUpdateAddressPageObject;

    const makeSUT = () => {
        addressPageObject = new CreateAndUpdateAddressPageObject();
    };

    beforeEach(() => {
        makeSUT();
    });

    it("should correctly create a new address", () => {
        cy.fixture("addressData").then((address: IAddressTestData) => {
            addressPageObject.createNewAddress(address);

            addressPageObject.verifyIfSuccessModalAppear();

            addressPageObject.closeSuccessModal();
        });
    });

    describe("validation tests", () => {
        it("should show validation error for invalid CEP format", () => {
            cy.fixture("addressData").then((data: IAddressTestData) => {
                const invalidCep = "123";
                let invalidAddress = { ...data, cep: invalidCep };

                addressPageObject.createNewAddress(invalidAddress);

                addressPageObject.verifyIfInvalidZipCodeModalAppear("Por favor, insira um CEP válido no formato XXXXX-XXX.");

                addressPageObject.closeInvalidZipCodeModal();
            });
        });
    });
});