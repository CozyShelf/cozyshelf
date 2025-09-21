import CreateAndUpdateCardPageObject from "../../support/pages/card/CreateAndUpdateCardPageObject";
import { ICardTestData } from "../../support/pages/types/TestData";

describe("add new credit card", () => {
    let cardPageObject: CreateAndUpdateCardPageObject;

    const makeSUT = () => {
        cardPageObject = new CreateAndUpdateCardPageObject();
    };

    beforeEach(() => {
        makeSUT();
    });

    it("should correctly create a new credit card", () => {
        cy.fixture("cardData").then((card: ICardTestData) => {
            cardPageObject.createNewCard(card);

            cardPageObject.verifyIfSuccessModalAppear();

            cardPageObject.closeSuccessModal();
        });
    });

    describe("validation tests", () => {
        it("should show validation error for invalid card number format", () => {
            cy.fixture("cardData").then((data: ICardTestData) => {
                const invalidNumber = "123";
                let invalidCard = { ...data, number: invalidNumber };

                cardPageObject.createNewCard(invalidCard);

                cardPageObject.verifyIfInvalidNumberModalAppear("Preencha o número do cartão corretamente.");

                cardPageObject.closeInvalidNumberModal
            });
        });

        it("should show validation error for invalid CVV format", () => {
            cy.fixture("cardData").then((data: ICardTestData) => {
                const invalidCvv = "12";
                let invalidCard = { ...data, cvv: invalidCvv };

                cardPageObject.createNewCard(invalidCard);

                cardPageObject.verifyIfInvalidCvvModalAppear("Preencha o CVV corretamente.");
                
                cardPageObject.closeInvalidCvvModal();
            });
        });

        it("should show validation error for invalid name field", () => {
            cy.fixture("cardData").then((data: ICardTestData) => {
                const wrongName = "joao22";
                let invalidCard = { ...data, impressName: wrongName };

                cardPageObject.createNewCard(invalidCard);

                cardPageObject.verifyIfInvalidNameModalAppear("Preencha o nome impresso no cartão corretamente.");

                cardPageObject.closeInvalidNameModal();
            });
        });
    });
});