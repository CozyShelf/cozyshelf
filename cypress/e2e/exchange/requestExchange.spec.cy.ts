import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";
import CheckoutPageObject from "../../support/pages/cart/CheckoutPageObject";
import OrderConfirmationPageObject from "../../support/pages/cart/OrderConfirmationPageObject";
import ExchangePageObject from "../../support/pages/exchange/ExchangePageObject";
import AdminOrdersPageObject from "../../support/pages/admin/AdminOrdersPageObject";
import OrderTestHelper from "../../support/helpers/OrderTestHelper";

describe("Exchange and Order Status Management", () => {
	let exchangePageObject: ExchangePageObject;
	let checkoutPageObject: CheckoutPageObject;
	let orderConfirmationPageObject: OrderConfirmationPageObject;
	let adminOrdersPageObject: AdminOrdersPageObject;
	let orderTestHelper: OrderTestHelper;
	let orderId: string;
	let fullOrderId: string;

	const makeSUT = () => {
		checkoutPageObject = new CheckoutPageObject(new AddCartItensPageObject());
		exchangePageObject = new ExchangePageObject(checkoutPageObject);
		orderConfirmationPageObject = new OrderConfirmationPageObject();
		adminOrdersPageObject = new AdminOrdersPageObject();
		orderTestHelper = new OrderTestHelper(
			checkoutPageObject,
			orderConfirmationPageObject
		);
	};

	beforeEach(() => {
		makeSUT();
	});

	describe("Complete Exchange Flow", () => {
		it("should complete the full exchange flow", () => {
			exchangePageObject.makeExchangeOrder();

			orderConfirmationPageObject.verifySuccessMessageAndClose();
			orderConfirmationPageObject.waitForRedirectToOrders();

			cy.get("tbody tr")
				.first()
				.find("td")
				.first()
				.invoke("text")
				.then((text) => {
					orderId = text.trim();
					cy.log(`Order ID: ${orderId}`);

					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyAdminOrdersPageLoaded();

					adminOrdersPageObject.clickOrderByIdInAdminList(orderId);
					cy.wait(1000);

					cy.url().then((url) => {
						fullOrderId = url.split("/").pop()!;

						adminOrdersPageObject.verifyApproveOrderButtonExists();
						adminOrdersPageObject.approveOrder();
						adminOrdersPageObject.verifySuccessMessageAndClose();

						// Verificar status "Em trânsito" na lista
						adminOrdersPageObject.visitAdminOrdersPage();
						adminOrdersPageObject.verifyOrderStatusById(orderId, "Em trânsito");

						// Voltar para os detalhes do pedido
						adminOrdersPageObject.visitAdminOrderDetailsPage(fullOrderId);
						cy.wait(1000);

						adminOrdersPageObject.verifyConfirmDeliveryButtonExists();
						adminOrdersPageObject.confirmDelivery();
						adminOrdersPageObject.verifySuccessMessageAndClose();

						// Verificar status "Entregue" na lista
						adminOrdersPageObject.visitAdminOrdersPage();
						adminOrdersPageObject.verifyOrderStatusById(orderId, "Entregue");

						orderConfirmationPageObject.visitOrdersPage();
						orderConfirmationPageObject.verifyOrdersPageLoaded();

						orderConfirmationPageObject.clickOrderById(orderId);
						cy.wait(1000);

						orderConfirmationPageObject.verifyExchangeButtonExists();

						exchangePageObject.clickExchangeButton();

						exchangePageObject.verifyExchangeModalIsVisible();

						exchangePageObject.selectAllBooksForExchange();

						exchangePageObject.submitExchange();

						exchangePageObject.verifyExchangeSuccessMessageAndClose();

						cy.wait(1500);
						exchangePageObject.verifyOrderStatusIsInExchange();

						// Voltar para admin e verificar status "Em troca"
						adminOrdersPageObject.visitAdminOrdersPage();
						adminOrdersPageObject.verifyAdminOrdersPageLoaded();
						adminOrdersPageObject.verifyOrderStatusById(orderId, "Em troca");

						// Acessar detalhes do pedido para confirmar troca
						adminOrdersPageObject.visitAdminOrderDetailsPage(fullOrderId);
						cy.wait(1000);

						adminOrdersPageObject.verifyConfirmExchangeButtonExists();

						adminOrdersPageObject.confirmExchange();

						adminOrdersPageObject.verifySuccessMessageAndClose();

						// Verificar status "Trocado" na lista
						adminOrdersPageObject.visitAdminOrdersPage();
						adminOrdersPageObject.verifyOrderStatusById(orderId, "Trocado");
					});
				});
		});
	});

	describe("Admin Order Status Management", () => {
		it("should approve an order and change status to 'Em trânsito'", () => {
			orderTestHelper.createOrder().then((id: string) => {
				orderId = id;
				cy.log(`Order ID: ${orderId}`);

				adminOrdersPageObject.visitAdminOrdersPage();
				adminOrdersPageObject.verifyAdminOrdersPageLoaded();

				adminOrdersPageObject.verifyOrderInAdminList();

				adminOrdersPageObject.clickOrderByIdInAdminList(orderId);
				cy.wait(1000);

				cy.url().then((url) => {
					fullOrderId = url.split("/").pop()!;

					// Verificar status inicial na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(
						orderId,
						"Em processamento"
					);

					// Voltar para detalhes e aprovar
					adminOrdersPageObject.visitAdminOrderDetailsPage(fullOrderId);
					cy.wait(1000);

					adminOrdersPageObject.verifyApproveOrderButtonExists();

					adminOrdersPageObject.approveOrder();

					adminOrdersPageObject.verifySuccessMessageAndClose();

					// Verificar status na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Em trânsito");
				});
			});
		});

		it("should confirm delivery and change status to 'Entregue'", () => {
			orderTestHelper.createOrder().then((id: string) => {
				orderId = id;
				cy.log(`Order ID: ${orderId}`);

				adminOrdersPageObject.visitAdminOrdersPage();
				adminOrdersPageObject.verifyAdminOrdersPageLoaded();
				adminOrdersPageObject.clickOrderByIdInAdminList(orderId);
				cy.wait(1000);

				cy.url().then((url) => {
					fullOrderId = url.split("/").pop()!;

					adminOrdersPageObject.verifyApproveOrderButtonExists();
					adminOrdersPageObject.approveOrder();
					adminOrdersPageObject.verifySuccessMessageAndClose();

					// Verificar status "Em trânsito" na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Em trânsito");

					// Voltar para detalhes e confirmar entrega
					adminOrdersPageObject.visitAdminOrderDetailsPage(fullOrderId);
					cy.wait(1000);

					adminOrdersPageObject.verifyConfirmDeliveryButtonExists();

					adminOrdersPageObject.confirmDelivery();

					adminOrdersPageObject.verifySuccessMessageAndClose();

					// Verificar status "Entregue" na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Entregue");
				});
			});
		});

		it("should confirm exchange and change status to 'Trocado'", () => {
			orderTestHelper.createOrder().then((id: string) => {
				orderId = id;
				cy.log(`Order ID: ${orderId}`);

				adminOrdersPageObject.visitAdminOrdersPage();
				adminOrdersPageObject.verifyAdminOrdersPageLoaded();
				adminOrdersPageObject.clickOrderByIdInAdminList(orderId);
				cy.wait(1000);

				cy.url().then((url) => {
					fullOrderId = url.split("/").pop()!;

					adminOrdersPageObject.approveOrder();
					adminOrdersPageObject.verifySuccessMessageAndClose();

					// Verificar status na lista e voltar para detalhes
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Em trânsito");
					adminOrdersPageObject.visitAdminOrderDetailsPage(fullOrderId);
					cy.wait(1000);

					adminOrdersPageObject.confirmDelivery();
					adminOrdersPageObject.verifySuccessMessageAndClose();

					// Verificar status na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Entregue");

					orderTestHelper.requestExchange(fullOrderId);

					// Verificar status "Em troca" na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Em troca");

					// Acessar detalhes para confirmar troca
					adminOrdersPageObject.visitAdminOrderDetailsPage(fullOrderId);
					cy.wait(1000);

					adminOrdersPageObject.verifyConfirmExchangeButtonExists();

					adminOrdersPageObject.confirmExchange();

					adminOrdersPageObject.verifySuccessMessageAndClose();

					// Verificar status "Trocado" na lista
					adminOrdersPageObject.visitAdminOrdersPage();
					adminOrdersPageObject.verifyOrderStatusById(orderId, "Trocado");
				});
			});
		});
	});
});
