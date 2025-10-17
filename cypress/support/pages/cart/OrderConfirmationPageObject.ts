import GenericPageObject from "../GenericPageObject";

/**
 * Page Object para verificação de confirmação de pedidos após checkout
 */
export default class OrderConfirmationPageObject extends GenericPageObject {
	private readonly ORDERS_PAGE: string;

	constructor() {
		super();
		this.ORDERS_PAGE = `http://localhost:3000/orders`;
	}

	/* ========== Navigation Methods ========== */

	visitOrdersPage() {
		this.visitPage(this.ORDERS_PAGE);
	}

	visitOrderDetailsPage(orderId: string) {
		this.visitPage(`${this.ORDERS_PAGE}/${orderId}`);
	}

	/* ========== Success Modal Verification ========== */

	/**
	 * Verifica se o modal de sucesso do SweetAlert2 está visível
	 * Modal genérico com título "Sucesso!" e ícone de success
	 */
	verifySuccessMessage() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-success", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Sucesso!");
	}

	/**
	 * Verifica mensagem de sucesso e fecha o modal
	 */
	verifySuccessMessageAndClose() {
		this.verifySuccessMessage();
		cy.wait(500);
		cy.get(".swal2-confirm").click();
		cy.wait(500);
	}

	/* ========== Order List Verification ========== */

	/**
	 * Verifica se há pelo menos um pedido na listagem
	 */
	verifyOrderInList() {
		cy.get('tbody tr', { timeout: 5000 })
			.should("exist")
			.and("have.length.at.least", 1);
	}

	/**
	 * Verifica se um pedido específico aparece na listagem pelo ID
	 */
	verifyOrderInListById(orderId: string) {
		const truncatedId = orderId.substring(0, 8);
		cy.contains('tbody tr td', truncatedId).should("exist");
	}

	/**
	 * Verifica o número total de pedidos na lista
	 */
	verifyOrderCount(expectedCount: number) {
		cy.get('tbody tr').should("have.length", expectedCount);
	}

	/* ========== Order Details Verification ========== */

	/**
	 * Verifica se a página de detalhes do pedido contém informações básicas
	 */
	verifyOrderDetailsPage() {
		cy.url().should("include", "/orders/");
		cy.get('form#client-register-form', { timeout: 5000 }).should("exist");
	}

	/**
	 * Verifica o status do pedido
	 */
	verifyOrderStatus(expectedStatus: string) {
		cy.get('.bg-dark-green.text-white.px-2.py-0\\.5.rounded-full').should("contain", expectedStatus);
	}

	/**
	 * Verifica o valor total do pedido nos detalhes
	 */
	verifyOrderTotal(expectedTotal: string) {
		cy.contains('h2', 'Total:').parent().find('p').should("contain", expectedTotal);
	}

	/**
	 * Verifica se o pedido contém um item específico
	 */
	verifyOrderContainsItem(itemName: string) {
		cy.get('.flex.flex-col.gap-4').within(() => {
			cy.contains('h2', itemName).should("exist");
		});
	}

	/**
	 * Verifica o endereço de entrega do pedido
	 */
	verifyOrderAddress(addressPhrase: string) {
		cy.contains('h2', 'Endereço de Entrega:').parent().find('select').should("contain", addressPhrase);
	}

	/**
	 * Verifica os métodos de pagamento do pedido
	 */
	verifyOrderPaymentMethods(expectedCount: number) {
		cy.contains('h2', 'Método de Pagamento:').parent().find('select option').should("have.length", expectedCount);
	}

	/* ========== Order Actions ========== */

	/**
	 * Clica no primeiro pedido da lista para ver detalhes
	 */
	clickFirstOrder() {
		cy.get('[data-cy="order-item"]').first().click();
	}

  /**
   * Click on a specific order in the list by its ID
   * @param orderId - The ID of the order to click
   */
  clickOrderById(orderId: string): void {
    // The orderId is shown truncated in the table (first 8 characters)
    const truncatedId = orderId.substring(0, 8);
    
    // Find the row containing the truncated ID and click the view link
    cy.contains('tbody tr td', truncatedId)
      .parent('tr')
      .within(() => {
        cy.get('a[href*="/orders/"]').click();
      });
  }	/* ========== Cart Verification After Order ========== */

	/**
	 * Verifica se o carrinho foi limpo após o pedido
	 * (Útil para testes de fluxo completo)
	 */
	verifyCartIsEmpty() {
		cy.visit(`http://localhost:3000/shopping-cart/${this.ALREADY_REGISTERED_CLIENT_ID}`);
		cy.wait(1000);
		
		// Verifica se não há itens no carrinho
		cy.get("#cart-items-list li").should("have.length", 0);
	}

	/* ========== Coupon Verification in Order ========== */

	/**
	 * Verifica se cupons foram aplicados no pedido (desconto maior que zero)
	 */
	verifyOrderHasCoupons() {
		cy.contains('h2', 'Descontos de cupons:').parent().find('p').should("not.contain", "R$ 0,00");
	}

	/**
	 * Verifica desconto de cupons no pedido
	 */
	verifyOrderCouponDiscount(expectedDiscount: string) {
		cy.contains('h2', 'Descontos de cupons:').parent().find('p').should("contain", expectedDiscount);
	}

	/* ========== Helper Methods ========== */

	/**
	 * Aguarda o redirecionamento para a página de pedidos
	 */
	waitForRedirectToOrders(timeoutMs: number = 5000) {
		cy.url().should("include", "/orders", { timeout: timeoutMs });
	}

	/**
	 * Verifica se a página de pedidos está carregada
	 */
	verifyOrdersPageLoaded() {
		cy.url().should("include", "/orders");
		cy.get('tbody', { timeout: 5000 }).should("exist");
	}
}
