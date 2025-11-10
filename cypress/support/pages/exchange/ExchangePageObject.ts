import CheckoutPageObject from "../cart/CheckoutPageObject";
import GenericPageObject from "../GenericPageObject";

export default class ExchangePageObject extends GenericPageObject {
	public constructor(private cartPageObject: CheckoutPageObject) {
		super();
	}

	public visitMakeExchangePage() {}

	public makeExchangeOrder() {
		this.cartPageObject.visitCartPageWithItems(2);

		this.cartPageObject.verifyCheckoutFormExists();
		this.cartPageObject.verifyFinishOrderButtonExists();

		this.cartPageObject.selectDeliveryAddress(
			"d5b4ecf2-e31e-41b2-8c9f-a36898e23d81"
		);
		this.cartPageObject.verifyAddressIsSelected(
			"d5b4ecf2-e31e-41b2-8c9f-a36898e23d81"
		);

		this.cartPageObject.selectAndAddCard(
			"a1b2c3d4-e5f6-7890-abcd-ef1234567890"
		);
		this.cartPageObject.verifyCardAddedToPayment(
			"a1b2c3d4-e5f6-7890-abcd-ef1234567890"
		);

		this.cartPageObject.getTotalAmount().then((totalText) => {
			const total = parseFloat(
				totalText.replace("R$", "").replace(",", ".").trim()
			);
			this.cartPageObject.updateCardAmount(0, total);
		});

		this.cartPageObject.submitCheckout();

		cy.wait(2000);
	}

	public clickExchangeButton() {
		cy.get("#exchange-btn").should("be.visible").click();

		cy.wait(500);
	}

	public verifyExchangeModalIsVisible() {
		cy.get("#exchange-modal")
			.should("be.visible")
			.and("not.have.class", "hidden");
	}

	public selectAllBooksForExchange() {
		cy.get("#exchange-all").should("be.visible").check();

		cy.wait(300);
	}

	public selectBookForExchange(bookId: string) {
		cy.get(`#book-${bookId}`).should("be.visible").check();
	}

	public verifyBookIsSelected(bookId: string) {
		cy.get(`#book-${bookId}`).should("be.checked");
	}

	public submitExchange() {
		cy.get('#exchange-modal button[type="submit"]')
			.should("be.visible")
			.click();

		cy.wait(2000);
	}

	public verifyExchangeSuccessMessage() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-success", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Troca realizada com sucesso!");
	}

	public verifyExchangeSuccessMessageAndClose() {
		this.verifyExchangeSuccessMessage();
		cy.wait(500);
		// Garantir que o botão está visível e clicável
		cy.get(".swal2-confirm")
			.should("be.visible")
			.should("not.be.disabled")
			.click({ force: false });
		cy.wait(1000); // Aguardar o reload da página
	}

	public verifyOrderStatusIsInExchange() {
		cy.get("span.bg-yellow-500.text-white.px-2.py-0\\.5.rounded-full")
			.should("be.visible")
			.and("contain", "Em troca");
	}
}
