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

	verifyRejectExchangeButtonExists() {
		cy.get("#reject-exchange-btn").should("exist").and("be.visible");
	}

	rejectExchange() {
		cy.get("#reject-exchange-btn").should("be.visible").click();
		cy.wait(1000);
	}

	verifyRejectExchangeSuccessMessage() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-success", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Sucesso!");
	}

	verifyRejectExchangeSuccessMessageAndClose() {
		this.verifyRejectExchangeSuccessMessage();
		cy.wait(500);
		cy.get(".swal2-confirm").click();
		cy.wait(500);
	}

	// Métodos para interagir com o modal de confirmação de estoque
	verifyStockConfirmationModalIsVisible() {
		cy.get("#confirm-stock-modal").should("not.have.class", "hidden");
		cy.get("#confirm-stock-modal").should("be.visible");
	}

	verifyStockConfirmationModalIsHidden() {
		cy.get("#confirm-stock-modal").should("have.class", "hidden");
	}

	verifyStockModalTitle() {
		cy.get("#confirm-stock-modal")
			.find("h2")
			.should("contain", "Confirmar Itens para Estoque");
	}

	verifyReturnAllCheckboxExists() {
		cy.get("#return-all-to-stock").should("exist");
	}

	checkReturnAllToStock() {
		cy.get("#return-all-to-stock")
			.should("exist")
			.then(($checkbox) => {
				if (!$checkbox.prop("checked")) {
					cy.wrap($checkbox).check({ force: true });
				}
			});
		cy.wait(500);
	}

	uncheckReturnAllToStock() {
		// Abordagem mais robusta: desmarcar diretamente todos os checkboxes
		// Primeiro, clicar no checkbox principal se estiver marcado
		cy.get("#return-all-to-stock")
			.should("exist")
			.then(($checkbox) => {
				if ($checkbox.prop("checked")) {
					cy.wrap($checkbox).click({ force: true });
				}
			});
		cy.wait(800);

		// Forçar desmarcação de todos os checkboxes individuais se ainda estiverem marcados
		cy.get(".stock-checkbox").each(($checkbox) => {
			cy.wrap($checkbox).then(($el) => {
				if ($el.prop("checked")) {
					cy.wrap($el).click({ force: true });
					cy.wait(100);
				}
			});
		});
		cy.wait(500);
	}

	uncheckAllStockCheckboxesIndividually() {
		// Método alternativo: desmarcar cada checkbox individualmente de forma forçada
		cy.get(".stock-checkbox").each(($checkbox, index) => {
			cy.wrap($checkbox).then(($el) => {
				if ($el.prop("checked")) {
					cy.log(`Desmarcando checkbox ${index}`);
					cy.wrap($el).click({ force: true });
					cy.wait(200);
				}
			});
		});
		cy.wait(800);
	}

	forceUncheckAllStockCheckboxes() {
		// Método de última instância: usar invoke para forçar desmarcação
		cy.get("#return-all-to-stock").invoke("prop", "checked", false);
		cy.get(".stock-checkbox").each(($checkbox) => {
			cy.wrap($checkbox).invoke("prop", "checked", false);
		});
		cy.wait(500);
		// Disparar evento change manualmente
		cy.get("#return-all-to-stock").trigger("change");
		cy.wait(500);
	}

	verifyAllStockCheckboxesAreChecked() {
		cy.wait(500); // Aguardar propagação do evento
		cy.get(".stock-checkbox").each(($checkbox) => {
			cy.wrap($checkbox).should("be.checked");
		});
	}

	verifyAllStockCheckboxesAreUnchecked() {
		cy.wait(1000); // Aguardar propagação do evento
		cy.get(".stock-checkbox", { timeout: 6000 }).each(($checkbox) => {
			cy.wrap($checkbox).should("not.be.checked");
		});
	}

	checkSpecificBookForStock(bookIndex: number) {
		cy.get(".stock-checkbox")
			.eq(bookIndex)
			.then(($checkbox) => {
				if (!$checkbox.prop("checked")) {
					cy.wrap($checkbox).click({ force: true });
				}
			});
		cy.wait(300);
	}

	uncheckSpecificBookForStock(bookIndex: number) {
		cy.get(".stock-checkbox")
			.eq(bookIndex)
			.then(($checkbox) => {
				if ($checkbox.prop("checked")) {
					cy.wrap($checkbox).click({ force: true });
				}
			});
		cy.wait(500);
	}

	verifySelectedCount(expectedCount: number) {
		cy.get("#selected-count").should("contain", expectedCount.toString());
	}

	setStockQuantityForBook(bookIndex: number, quantity: number) {
		cy.get(".stock-quantity").eq(bookIndex).clear().type(quantity.toString());
		cy.wait(200);
	}

	verifyStockQuantityForBook(bookIndex: number, expectedQuantity: number) {
		cy.get(".stock-quantity")
			.eq(bookIndex)
			.should("have.value", expectedQuantity.toString());
	}

	clickConfirmStockReturn() {
		cy.get("#confirm-stock-return").should("be.visible").click();
		cy.wait(1000);
	}

	clickCancelStockModal() {
		cy.get("#cancel-stock-confirmation").click();
		cy.wait(300);
	}

	clickCloseStockModal() {
		cy.get("#close-confirm-stock-modal").click();
		cy.wait(300);
	}

	verifyStockReturnSuccessMessage() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-success", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Sucesso!");
		cy.get(".swal2-html-container").should(
			"contain",
			"Troca confirmada e itens retornados ao estoque com sucesso!"
		);
	}

	verifyStockWarningMessage() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-warning", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Atenção!");
		cy.get(".swal2-html-container").should(
			"contain",
			"Selecione pelo menos um item para retornar ao estoque."
		);
	}

	verifyStockReturnSuccessMessageAndClose() {
		this.verifyStockReturnSuccessMessage();
		cy.wait(500);
		cy.get(".swal2-confirm").click();
		cy.wait(500);
	}

	verifyStockWarningMessageAndClose() {
		this.verifyStockWarningMessage();
		cy.wait(500);
		cy.get(".swal2-confirm").click();
		cy.wait(500);
	}

	confirmExchangeWithStockSelection(selectAll: boolean = true) {
		// Clica no botão de confirmar troca que abre o modal
		this.confirmExchange();

		// Verifica que o modal está visível
		this.verifyStockConfirmationModalIsVisible();

		// Seleciona itens para retorno ao estoque
		if (selectAll) {
			this.checkReturnAllToStock();
		}

		// Confirma o retorno ao estoque
		this.clickConfirmStockReturn();

		// Aguarda o processamento
		cy.wait(1500);
	}
}
