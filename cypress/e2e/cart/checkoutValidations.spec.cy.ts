import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";
import CheckoutPageObject from "../../support/pages/cart/CheckoutPageObject";

describe("checkout validations", () => {
	let addCartItensPageObject: AddCartItensPageObject;
	let checkoutPageObject: CheckoutPageObject;

	const TEST_ADDRESS_ID = "d5b4ecf2-e31e-41b2-8c9f-a36898e23d81";
	const TEST_CARD_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
	
	const PROMOTIONAL_COUPONS = {
        PROMO20: "d1f7c8e3-3c4b-4f5a-9e6b-2e7f8c9d0a1b", // Desconto Verão 20% 2025
        BLACKFRIDAY: "a9ad6f2d-7f5b-4684-9c98-b9bc0e1397da", // Desconto Outono 30% 2025
    };

	const EXCHANGE_COUPONS = {
        TROCA004: "78f9a1b2-6e5d-4f7a-9b8c-4c9d0e1f2a3b",  // Cupom de troca #4 - R$ 15
		TROCA005: "8df94113-76dd-4b68-a481-4be9b50986eb"  // Cupom de troca #5 - R$ 15
    };

	const makeSUT = () => {
		addCartItensPageObject = new AddCartItensPageObject();
		checkoutPageObject = new CheckoutPageObject(addCartItensPageObject);
	};

	beforeEach(() => {
		makeSUT();
		checkoutPageObject.visitCartPageWithItems(2);
	});

	describe("address validation", () => {
		it("should require address selection", () => {
			checkoutPageObject.verifyAddressRequired();
		});

		it("should create and use new address during checkout", () => {
			cy.fixture("addressData2.json").then((newAddressData) => {
				checkoutPageObject.clickAddAddressButton();
				checkoutPageObject.fillAddressModalForm(newAddressData);
				checkoutPageObject.submitAddressModal();

				cy.wait(1000);
				cy.get(".swal2-container").should("be.visible");
				cy.get(".swal2-icon-success").should("be.visible");
			});
		});
	});

	describe("payment validation", () => {
		it("should show error when no payment method is added", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.submitCheckout();

			cy.get(".swal2-container").should("be.visible");
			cy.get(".swal2-icon-error").should("be.visible");
			cy.get(".swal2-title").should("contain", "Dados Incompletos");
		});

		it("should show error when card amount is zero", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);
			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			checkoutPageObject.updateCardAmount(0, 0);

			checkoutPageObject.submitCheckout();

			cy.get(".swal2-container").should("be.visible");
			cy.get(".swal2-icon-error").should("be.visible");
			cy.get(".swal2-title").should("contain", "Dados Incompletos");
		});

		it("should show error when card amount is less than total", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);
			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);
				const lessAmount = total - 10;
				checkoutPageObject.updateCardAmount(0, lessAmount);

				checkoutPageObject.submitCheckout();

				cy.get(".swal2-container").should("be.visible");
				cy.get(".swal2-icon-error").should("be.visible");
				cy.get(".swal2-title").should("contain", "Dados Incompletos");
			});
		});

		it("should show error when card amount exceeds total", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);
			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);
				const moreAmount = total + 10;

				cy.get('input[data-card-index="0"]')
					.clear()
					.type(moreAmount.toString())
					.blur();

				cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
				cy.get(".swal2-icon-warning").should("be.visible");
				cy.get(".swal2-title").should("contain", "Valor excede o total");
			});
		});

		it("should show error when card amount is less than minimum (R$ 10)", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);
			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			cy.get('input[data-card-index="0"]').clear().type("5").blur();

			cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
			cy.get(".swal2-icon-error").should("be.visible");
			cy.get(".swal2-title").should("contain", "Valor inválido");
		});

		it("should allow card amount less than R$ 10 when coupons are applied and remaining is less than R$ 10", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.BLACKFRIDAY);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA004);
			checkoutPageObject.applyCoupons();

			cy.wait(1000);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				if (total > 0 && total < 10) {
					checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
					checkoutPageObject.updateCardAmount(0, total);

					checkoutPageObject.submitCheckout();

					cy.wait(2000);
					cy.get(".swal2-container").should("not.contain", "valor mínimo");
				}
			});
		});

		it("should not require payment when coupons cover full amount", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.BLACKFRIDAY);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA004);
			checkoutPageObject.applyCoupons();

			cy.wait(1000);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				if (total <= 0) {
					checkoutPageObject.submitCheckout();

					cy.wait(2000);
					cy.get(".swal2-container").should("not.contain", "cartão");
				}
			});
		});
	});

	describe("multiple cards validation", () => {
		it("should create second card for multiple card tests", () => {
			cy.fixture("cardData2.json").then((card2Data) => {
				checkoutPageObject.clickAddCardButton();
				cy.get("#modal-container", { timeout: 5000 }).should("be.visible");
				checkoutPageObject.fillCardModalForm(card2Data);
				checkoutPageObject.submitCardModal();

				cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
				cy.get(".swal2-icon-success").should("be.visible");
				checkoutPageObject.closeModal();

				cy.wait(1000);

				cy.get("#card-selector option").should("have.length.at.least", 2);
			});
		});

		it("should not allow creating card with duplicate number", () => {
			cy.fixture("cardData2.json").then((card2Data) => {
				checkoutPageObject.clickAddCardButton();
				cy.get("#modal-container", { timeout: 5000 }).should("be.visible");
				checkoutPageObject.fillCardModalForm(card2Data);
				checkoutPageObject.submitCardModal();

				cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
				cy.get(".swal2-icon-error", { timeout: 5000 }).should("be.visible");
			});
		});

		it("should show error when trying to add same card twice", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			cy.wait(500);

			cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
			cy.get(".swal2-icon").should("exist");
		});

		it("should validate sum of multiple cards equals total", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				const card1Amount = Math.max(10, total * 0.4);
				const card2Amount = Math.max(10, total * 0.4);

				const adjustedCard1 = card1Amount;
				const adjustedCard2 = Math.min(card2Amount, total - card1Amount - 5);

				checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
				checkoutPageObject.updateCardAmount(0, adjustedCard1);

				cy.get("#card-selector option")
					.last()
					.then(($option) => {
						const newCardId = $option.val() as string;
						checkoutPageObject.selectAndAddCard(newCardId);
						checkoutPageObject.updateCardAmount(1, adjustedCard2);

						checkoutPageObject.submitCheckout();

						cy.get(".swal2-container").should("be.visible");
						cy.get(".swal2-icon-error").should("be.visible");
						cy.get(".swal2-title").should("contain", "Dados Incompletos");
					});
			});
		});

		it("should allow checkout when multiple cards sum equals total", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
				checkoutPageObject.updateCardAmount(0, total / 2);

				cy.get("#card-selector option")
					.last()
					.then(($option) => {
						const newCardId = $option.val() as string;
						checkoutPageObject.selectAndAddCard(newCardId);
						checkoutPageObject.updateCardAmount(1, total / 2);

						checkoutPageObject.submitCheckout();

						cy.wait(2000);
						cy.get(".swal2-icon-error").should("not.exist");
					});
			});
		});

		it("should enforce minimum value of R$ 10 per card", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.selectAndAddCard(TEST_CARD_ID);

			cy.get('input[data-card-index="0"]').clear().type("5").blur();

			cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
			cy.get(".swal2-icon-error").should("be.visible");
		});

		it("should allow values below R$ 10 when remaining amount after coupons is less than R$ 10", () => {
			checkoutPageObject.selectDeliveryAddress(TEST_ADDRESS_ID);

			checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.BLACKFRIDAY);
			checkoutPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA004);
			checkoutPageObject.applyCoupons();

			cy.wait(1000);

			checkoutPageObject.getTotalAmount().then((totalText) => {
				const total = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				if (total > 0 && total < 10) {
					checkoutPageObject.selectAndAddCard(TEST_CARD_ID);
					checkoutPageObject.updateCardAmount(0, total / 2);

					cy.get("#card-selector option")
						.last()
						.then(($option) => {
							const newCardId = $option.val() as string;
							checkoutPageObject.selectAndAddCard(newCardId);
							checkoutPageObject.updateCardAmount(1, total / 2);

							checkoutPageObject.submitCheckout();

							cy.wait(2000);
							cy.get(".swal2-container").should("not.contain", "valor mínimo");
						});
				}
			});
		});
	});

	describe("coupon validation during checkout", () => {
		it("should recalculate total when coupons are applied", () => {
			checkoutPageObject.getTotalAmount().then((totalText) => {
				const initialTotal = parseFloat(
					totalText.replace("R$", "").replace(",", ".").trim()
				);

				checkoutPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.PROMO20);
				checkoutPageObject.applyCoupons();

				cy.wait(500);

				checkoutPageObject.getTotalAmount().should("not.contain", totalText);
			});
		});
	});
});
