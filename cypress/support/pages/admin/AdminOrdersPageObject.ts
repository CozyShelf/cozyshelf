import GenericPageObject from "../GenericPageObject";

export default class AdminOrdersPageObject extends GenericPageObject {
	private readonly ADMIN_ORDERS_PAGE: string;

	constructor() {
		super();
		this.ADMIN_ORDERS_PAGE = "http://localhost:3000/admin/orders";
	}

	visitAdminOrdersPage() {
		this.visitPage(this.ADMIN_ORDERS_PAGE);
	}

	visitAdminOrderDetailsPage(orderId: string) {
		this.visitPage(`${this.ADMIN_ORDERS_PAGE}/${orderId}`);
	}

	verifyAdminOrdersPageLoaded() {
		cy.url().should("include", "/admin/orders");
		cy.get("tbody", { timeout: 5000 }).should("exist");
	}

	verifyOrderInAdminList() {
		cy.get("tbody tr", { timeout: 5000 })
			.should("exist")
			.and("have.length.at.least", 1);
	}

	clickFirstOrderInAdminList() {
		cy.get("tbody tr")
			.first()
			.within(() => {
				cy.get('a[href*="/admin/orders/"]').click();
			});
	}

	clickOrderByIdInAdminList(orderId: string) {
		const truncatedId = orderId.substring(0, 8);

		cy.contains("tbody tr td", truncatedId)
			.parent("tr")
			.within(() => {
				cy.get('a[href*="/admin/orders/"]').click();
			});
	}

	approveOrder() {
		cy.get("#approve-order-btn").should("be.visible").click();

		cy.wait(1000);
	}

	confirmDelivery() {
		cy.get("#confirm-delivery-btn").should("be.visible").click();

		cy.wait(1000);
	}

	confirmExchange() {
		cy.get("#confirm-exchange-btn").should("be.visible").click();

		cy.wait(1000);
	}

	verifyOrderStatusById(orderId: string, expectedStatus: string) {
		const truncatedId = orderId.substring(0, 8);

		// Verificar o status de um pedido específico na lista
		cy.contains("tbody tr td", truncatedId)
			.parent("tr")
			.within(() => {
				cy.get("span.px-2.py-0\\.5.rounded-full").should(
					"contain",
					expectedStatus
				);
			});
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

	verifyApproveOrderButtonExists() {
		cy.get("#approve-order-btn").should("exist").and("be.visible");
	}

	verifyConfirmDeliveryButtonExists() {
		cy.get("#confirm-delivery-btn").should("exist").and("be.visible");
	}

	verifyConfirmExchangeButtonExists() {
		cy.get("#confirm-exchange-btn").should("exist").and("be.visible");
	}
}
