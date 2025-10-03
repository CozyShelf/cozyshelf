import CardTablePageObject from "../../support/pages/card/CardTablePageObject";
import CreateAndUpdateCardPageObject from "../../support/pages/card/CreateAndUpdateCardPageObject";

describe("delete a credit card", () => {
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
    });

    it("should show a warning modal when trying to delete a preferred card", () => {
        makeSUT();
        cardTablePageObject.deleteCardErrorPreferredCard(0);

        cardTablePageObject.verifyIfWarningPreferredCardModalAppear(
            "Você não pode excluir o cartão preferencial. Defina outro cartão como preferencial antes de excluir este."
        );

        cardTablePageObject.closeWarningPreferredCardModal();
    });

    it("should delete a non-preferred card successfully", () => {
        makeSUT();
        cardTablePageObject.deleteCardSucess(1);

        cardTablePageObject.verifyIfDeleteConfirmationModalAppear();
        cardTablePageObject.closeDeleteConfirmationModal();

        cardTablePageObject.verifyIfSuccessModalAppear();
        cardTablePageObject.closeSuccessModal();

        cardTablePageObject.verifyIfCardIsDeleted(1);
    });
});