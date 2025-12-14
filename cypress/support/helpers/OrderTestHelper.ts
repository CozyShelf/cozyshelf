import CheckoutPageObject from "../pages/cart/CheckoutPageObject";
import OrderConfirmationPageObject from "../pages/cart/OrderConfirmationPageObject";

/**
 * Helper para criar pedidos de forma rápida nos testes
 */
export default class OrderTestHelper {
	constructor(
		private checkoutPageObject: CheckoutPageObject,
		private orderConfirmationPageObject: OrderConfirmationPageObject
	) {}

	/**
	 * Cria um pedido completo e retorna o ID truncado
	 */
	createOrder() {
		this.checkoutPageObject.visitCartPageWithItems(2);
		this.checkoutPageObject.verifyCheckoutFormExists();
		this.checkoutPageObject.verifyFinishOrderButtonExists();

		this.checkoutPageObject.selectDeliveryAddress(
			"d5b4ecf2-e31e-41b2-8c9f-a36898e23d81"
		);
		this.checkoutPageObject.verifyAddressIsSelected(
			"d5b4ecf2-e31e-41b2-8c9f-a36898e23d81"
		);

		this.checkoutPageObject.selectAndAddCard(
			"a1b2c3d4-e5f6-7890-abcd-ef1234567890"
		);
		this.checkoutPageObject.verifyCardAddedToPayment(
			"a1b2c3d4-e5f6-7890-abcd-ef1234567890"
		);

		this.checkoutPageObject.getTotalAmount().then((totalText) => {
			const total = parseFloat(
				totalText.replace("R$", "").replace(",", ".").trim()
			);
			this.checkoutPageObject.updateCardAmount(0, total);
		});

		this.checkoutPageObject.submitCheckout();
		cy.wait(2000);

		this.orderConfirmationPageObject.verifySuccessMessageAndClose();
		this.orderConfirmationPageObject.waitForRedirectToOrders();

		return cy
			.get("tbody tr")
			.first()
			.find("td")
			.first()
			.invoke("text")
			.then((text) => text.trim());
	}

	/**
	 * Solicita troca para um pedido
	 */
	requestExchange(orderId: string): void {
		this.orderConfirmationPageObject.visitOrderDetailsPage(orderId);
		cy.wait(1000);

		// Clicar no botão de troca
		cy.get("#exchange-btn").should("be.visible").click();
		cy.wait(500);

		// Selecionar todos os itens
		cy.get("#exchange-all").should("be.visible").check();
		cy.wait(300);

		// Submeter troca
		cy.get('#exchange-modal button[type="submit"]')
			.should("be.visible")
			.click();
		cy.wait(2000);

		// Fechar modal de confirmação
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-confirm")
			.should("be.visible")
			.should("not.be.disabled")
			.click();
		cy.wait(1500);
	}
}
