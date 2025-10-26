import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";
import CheckoutPageObject from "../../support/pages/cart/CheckoutPageObject";
import OrderConfirmationPageObject from "../../support/pages/cart/OrderConfirmationPageObject";

describe("checkout flow - complete purchase", () => {
	let addCartItensPageObject: AddCartItensPageObject;
	let checkoutPageObject: CheckoutPageObject;
	let orderConfirmationPageObject: OrderConfirmationPageObject;

	const TEST_ADDRESS_ID = "d5b4ecf2-e31e-41b2-8c9f-a36898e23d81";
	const TEST_CARD_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

	const PROMOTIONAL_COUPONS = {
        PROMO10: "709bf8da-4ca5-464a-8fc9-5dfbbe0ea412", // Desconto Primavera 10% 2025
        PROMO20: "d1f7c8e3-3c4b-4f5a-9e6b-2e7f8c9d0a1b", // Desconto Verão 20% 2025
        BLACKFRIDAY: "a9ad6f2d-7f5b-4684-9c98-b9bc0e1397da", // Desconto Outono 30% 2025
		WELCOME15: "f64bc03e-72a6-42aa-aba3-507f733ce355" // Desconto Welcome 15% 2025
    };

	const EXCHANGE_COUPONS = {
        TROCA001: "42caca40-cbb1-4dd0-b3bf-07e7ed651ad1", // Cupom de troca #1 - R$ 10
        TROCA002: "58d6f8e1-3c4b-4f5a-9e6b-2e7f8c9d0a1b", // Cupom de troca #2 - R$ 25
        TROCA003: "67e8f9a2-5d4c-4e6b-8f7a-3b8c9d0e1f2a", // Cupom de troca #3 - R$ 30
        TROCA004: "78f9a1b2-6e5d-4f7a-9b8c-4c9d0e1f2a3b",  // Cupom de troca #4 - R$ 15
		TROCA005: "8df94113-76dd-4b68-a481-4be9b50986eb"  // Cupom de troca #5 - R$ 15
    };

	const makeSUT = () => {
		addCartItensPageObject = new AddCartItensPageObject();
		checkoutPageObject = new CheckoutPageObject(addCartItensPageObject);
		orderConfirmationPageObject = new OrderConfirmationPageObject();
	};

	beforeEach(() => {
		makeSUT();
	});

	describe("complete checkout flow", () => {
		it("should complete a full purchase with address and payment", () => {
			checkoutPageObject.visitCartPageWithItems(2);

			checkoutPageObject.verifyCheckoutFormExists();
			checkoutPageObject.verifyFinishOrderButtonExists();

			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);
			checkoutPageObject.verifyAddressIsSelected(TEST_ADDRESS_ID);

			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
			checkoutPageObject.verifyCardAddedToPayment(TEST_CARD_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);
				checkoutPageObject.updateCardAmount(0, total);
			});

			checkoutPageObject.submitCheckout();

			cy.wait(2000);
			orderConfirmationPageObject.verifySuccessMessage();
		});

		it("should display cart items correctly before checkout", () => {
			checkoutPageObject.visitCartPageWithItems(3);

			cy.get("#cart-items-list li").should("have.length.at.least", 1);

			checkoutPageObject.getItemsSubtotal().should("not.be.empty");
			checkoutPageObject.getFreightValue().should("contain", "R$");
			checkoutPageObject.getTotalAmount().should("contain", "R$");
		});

		it("should redirect to orders page after successful checkout", () => {
			checkoutPageObject.visitCartPageWithItems(1);

			checkoutPageObject.fillCompleteCheckout(TEST_ADDRESS_ID, TEST_CARD_ID);

			checkoutPageObject.submitCheckout();

			checkoutPageObject.waitForSuccessModalAndClose();

			cy.wait(2000);
			cy.url().should("include", "/orders");

			orderConfirmationPageObject.verifyOrderInList();
		});
	});

	describe("checkout flow with coupons", () => {
		it("should complete checkout with promotional coupon", () => {
			checkoutPageObject.visitCartPageWithItems(2);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.PROMO10);
			checkoutPageObject.applyCoupons();

			checkoutPageObject.verifyAppliedCouponsStatus();
			checkoutPageObject.verifyCouponDiscount("R$");

			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				if (total > 0) {
					checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
					checkoutPageObject.updateCardAmount(0, total);
				}
			});

			checkoutPageObject.submitCheckout();

			cy.wait(2000);
			orderConfirmationPageObject.verifySuccessMessage();
		});

		it("should complete checkout with exchange coupon", () => {
			checkoutPageObject.visitCartPageWithItems(2);

			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA002);
			checkoutPageObject.applyCoupons();

			checkoutPageObject.verifyAppliedCouponsStatus();

			checkoutPageObject.fillCompleteCheckout(TEST_ADDRESS_ID, TEST_CARD_ID);
			checkoutPageObject.submitCheckout();

			cy.wait(2000);
			orderConfirmationPageObject.verifySuccessMessage();
		});

		it("should complete checkout with both promotional and exchange coupons", () => {
			checkoutPageObject.visitCartPageWithItems(3);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.PROMO20);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA005);
			checkoutPageObject.applyCoupons();

			checkoutPageObject.verifyAppliedCouponsStatus();

			checkoutPageObject.fillCompleteCheckout(TEST_ADDRESS_ID, TEST_CARD_ID);
			checkoutPageObject.submitCheckout();

			cy.wait(2000);
			orderConfirmationPageObject.verifySuccessMessage();
		});

		it("should disable payment when coupons cover full amount", () => {
			checkoutPageObject.visitCartPageWithItems(1);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.BLACKFRIDAY);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA001);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA003);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA004);
			checkoutPageObject.applyCoupons();

			cy.wait(1000);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				if (total <= 0) {
					checkoutPageObject.verifyPaymentDisabledWarning();
					checkoutPageObject.verifyPaymentControlsDisabled();
				}
			});
		});
	});

	describe("step by step flow verification", () => {
		it("should follow complete purchase flow step by step", () => {
			addCartItensPageObject.visitBookDetailsPage();

			addCartItensPageObject.addManyBooksToCart(2);
			addCartItensPageObject.verifyIfSuccessNotificationAppears();

			checkoutPageObject.visitCartPageWithItems(0);

			cy.get("#cart-items-list li").should("exist");

			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.WELCOME15);
			checkoutPageObject.applyCoupons();
			checkoutPageObject.verifyAppliedCouponsStatus();

			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);
				checkoutPageObject.updateCardAmount(0, total);
			});

			checkoutPageObject.submitCheckout();

			cy.wait(2000);
			orderConfirmationPageObject.verifySuccessMessage();

			cy.wait(1000);
			cy.visit(
				`http://localhost:3000/shopping-cart/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81`
			);
			cy.get("#empty-cart-title").should("be.visible");
		});
	});
});
