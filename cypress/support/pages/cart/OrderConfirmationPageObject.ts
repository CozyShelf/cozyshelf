import GenericPageObject from "../GenericPageObject";

export default class OrderConfirmationPageObject extends GenericPageObject {
	private readonly ORDERS_PAGE: string;

	constructor() {
		super();
		this.ORDERS_PAGE = `http://localhost:3000/orders`;
	}

	visitOrdersPage() {
		this.visitPage(this.ORDERS_PAGE);
	}

	visitOrderDetailsPage(orderId: string) {
		this.visitPage(`${this.ORDERS_PAGE}/${orderId}`);
	}

	verifySuccessMessage() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-success", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Sucesso!");
	}

	verifySuccessMessageAndClose() {
		this.verifySuccessMessage();
		cy.wait(500);
		cy.get(".swal2-confirm").click();
		cy.wait(500);
	}

	verifyOrderInList() {
		cy.get("tbody tr", { timeout: 5000 })
			.should("exist")
			.and("have.length.at.least", 1);
	}

	verifyOrderInListById(orderId: string) {
		const truncatedId = orderId.substring(0, 8);
		cy.contains("tbody tr td", truncatedId).should("exist");
	}

	verifyOrderCount(expectedCount: number) {
		cy.get("tbody tr").should("have.length", expectedCount);
	}

	verifyOrderDetailsPage() {
		cy.url().should("include", "/orders/");
		cy.get("form#client-register-form", { timeout: 5000 }).should("exist");
	}

	verifyOrderStatus(expectedStatus: string) {
		cy.get(".bg-dark-green.text-white.px-2.py-0\\.5.rounded-full").should(
			"contain",
			expectedStatus
		);
	}

	verifyOrderTotal(expectedTotal: string) {
		cy.contains("h2", "Total:")
			.parent()
			.find("p")
			.should("contain", expectedTotal);
	}

	verifyOrderContainsItem(itemName: string) {
		cy.get(".flex.flex-col.gap-4").within(() => {
			cy.contains("h2", itemName).should("exist");
		});
	}

	verifyOrderAddress(addressPhrase: string) {
		cy.contains("h2", "Endereço de Entrega:")
			.parent()
			.find("select")
			.should("contain", addressPhrase);
	}

	verifyOrderPaymentMethods(expectedCount: number) {
		cy.contains("h2", "Método de Pagamento:")
			.parent()
			.find("select option")
			.should("have.length", expectedCount);
	}

	clickFirstOrder() {
		cy.get('[data-cy="order-item"]').first().click();
	}

	clickOrderById(orderId: string): void {
		const truncatedId = orderId.substring(0, 8);

		cy.contains("tbody tr td", truncatedId)
			.parent("tr")
			.within(() => {
				cy.get('a[href*="/orders/"]').click();
			});
	}

	verifyCartIsEmpty() {
		cy.visit(
			`http://localhost:3000/shopping-cart/${this.ALREADY_REGISTERED_CLIENT_ID}`
		);
		cy.wait(1000);

		cy.get("#cart-items-list li").should("have.length", 0);
	}

	verifyOrderHasCoupons() {
		cy.contains("h2", "Descontos de cupons:")
			.parent()
			.find("p")
			.should("not.contain", "R$ 0,00");
	}

	verifyOrderCouponDiscount(expectedDiscount: string) {
		cy.contains("h2", "Descontos de cupons:")
			.parent()
			.find("p")
			.should("contain", expectedDiscount);
	}

	waitForRedirectToOrders(timeoutMs: number = 5000) {
		cy.url().should("include", "/orders", { timeout: timeoutMs });
	}

	verifyOrdersPageLoaded() {
		cy.url().should("include", "/orders");
		cy.get("tbody", { timeout: 5000 }).should("exist");
	}

	verifyExchangeButtonExists() {
		cy.get("#exchange-btn").should("exist").and("be.visible");
	}
}
