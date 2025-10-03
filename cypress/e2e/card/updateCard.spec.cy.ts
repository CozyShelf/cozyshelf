import CardTablePageObject from "../../support/pages/card/CardTablePageObject";
import CreateAndUpdateCardPageObject from "../../support/pages/card/CreateAndUpdateCardPageObject";

describe("update a credit card", () => {
    let cardTablePageObject : CardTablePageObject;
    let cardPageObject : CreateAndUpdateCardPageObject;

    const makeSUT = () => {
        cardTablePageObject = new CardTablePageObject();
        cardPageObject = new CreateAndUpdateCardPageObject();
    };

    // @ts-ignore - Cypress type issue
    before(() => {
        makeSUT();
        cardPageObject.visitCardCreatePage();
        cy.fixture("cardData").then((card) => {
            cardPageObject.createNewCard(card);
            cardPageObject.verifyIfSuccessModalAppear();
            cardPageObject.closeSuccessModal();
        });
    });

    beforeEach(() => {
        makeSUT();
        cardTablePageObject.visitCardTablePage();
    });

    it("should correctly update a credit card", () => {
        cardTablePageObject.clickInDetailButton(0);
        cy.fixture("cardData").then((updatedCard) => {
            const newCardNumberData = "5555666677778884";

            cardPageObject.updateDataCard(newCardNumberData, "card-number");
            cardPageObject.sendUpdateCardData();

            cardPageObject.verifyIfUpdateCardModalAppear();
            cardPageObject.closeUpdateCardModal();
        });
    });
   
    it("should show an error modal when trying to update a card with an invalid number", () => {
        cardTablePageObject.clickInDetailButton(0);
        const invalidCardNumber = "1474";

        cardPageObject.updateDataCard(invalidCardNumber, "card-number");
        cardPageObject.sendUpdateCardData();

        cardPageObject.verifyIfInvalidNumberModalAppear("Preencha o número do cartão corretamente.");
        cardPageObject.closeInvalidNumberModal();
    });

    it("should show an error modal when trying to update a card with an invalid CVV", () => {
        cardTablePageObject.clickInDetailButton(0);
        const invalidCvv = "12";
        cardPageObject.updateDataCard(invalidCvv, "card-cvv");
        cardPageObject.sendUpdateCardData();

        cardPageObject.verifyIfInvalidCvvModalAppear("Preencha o CVV corretamente.");
        cardPageObject.closeInvalidCvvModal();
    });

    it("should show an error modal when trying to update a card with an invalid name", () => {
        cardTablePageObject.clickInDetailButton(0);
        const invalidName = "A";
        cardPageObject.updateDataCard(invalidName, "card-impress-name");
        cardPageObject.sendUpdateCardData();

        cardPageObject.verifyIfInvalidNameModalAppear("Preencha o nome impresso no cartão corretamente.");
        cardPageObject.closeInvalidNameModal();
    });
});