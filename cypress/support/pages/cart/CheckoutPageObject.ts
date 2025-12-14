import GenericPageObject from "../GenericPageObject";
import AddCartItensPageObject from "./AddCartItensPageObject";

export default class CheckoutPageObject extends GenericPageObject {
	private readonly CART_PAGE: string;

	public constructor(
		private readonly addItemToCartPageObject: AddCartItensPageObject
	) {
		super();
		this.CART_PAGE = `http://localhost:3000/shopping-cart/${this.ALREADY_REGISTERED_CLIENT_ID}`;
	}

	visitCartPageWithItems(numberOfItems: number = 3) {
		this.addItemToCartPageObject.visitBookDetailsPage();
		this.addItemToCartPageObject.addManyBooksToCart(numberOfItems);
		this.visitPage(this.CART_PAGE);
	}

	selectDeliveryAddress(addressId: string) {
		cy.get("#userAddress").should("be.visible");
		this.selectValue("userAddress", addressId);
		cy.wait(300);
	}

	verifyAddressIsSelected(addressId: string) {
		this.verifySelectValue("userAddress", addressId);
	}

	verifyAddressRequired() {
		const addressSelect = cy.get('select[name="userAddress"]');
		addressSelect.should("have.attr", "required");
	}

    selectPromotionalCoupon(couponId: string) {
        cy.get("#promotional-coupon-select").should("be.visible");
        this.selectValue("promotional-coupon-select", couponId);
    }

    selectExchangeCoupon(couponId: string) {
        cy.get(`input[name="exchangeCoupons"][value="${couponId}"]`).should("be.visible");
        cy.get(`input[name="exchangeCoupons"][value="${couponId}"]`).check({ force: true });
    }

	applyCoupons() {
		cy.get("#apply-coupons").should("be.visible").and("not.be.disabled");
		this.clickButton("apply-coupons");

		cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Cupons aplicados!");
		cy.get(".swal2-confirm").click();
		cy.wait(1000);
	}

	resetCoupons() {
		this.clickButton("reset-coupons");

		cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-confirm").click();
		cy.wait(500);
	}

	verifyAppliedCouponsStatus() {
		cy.get("#applied-coupons-status").should("be.visible");
	}

	verifyCouponDiscount(expectedDiscount: string) {
		cy.get("#coupons-discount").should("contain", expectedDiscount);
	}

	verifyResetButtonVisible() {
		cy.get("#reset-coupons").should("be.visible");
	}

	selectCard(cardId: string) {
		cy.get("#card-selector").should("be.visible").and("not.be.disabled");
		this.selectValue("card-selector", cardId);
	}

	addCardToPayment() {
		cy.get("#add-card-to-payment").should("be.visible").and("not.be.disabled");
		this.clickButton("add-card-to-payment");
		cy.wait(500);
	}

	selectAndAddCard(cardId: string) {
		this.selectCard(cardId);
		this.addCardToPayment();
		cy.get(`#selected-cards input[name="cardUuid"][value="${cardId}"]`, {
			timeout: 10000,
		}).should("exist");
		cy.wait(500);
	}

	verifyCardAddedToPayment(cardId: string) {
		cy.get(`#selected-cards input[name="cardUuid"][value="${cardId}"]`, {
			timeout: 5000,
		}).should("exist");
	}

	updateCardAmount(cardIndex: number, amount: number) {
		cy.get(`#selected-cards`, { timeout: 5000 }).should("be.visible");
		cy.get(
			`#selected-cards input[type="number"][data-card-index="${cardIndex}"]`,
			{ timeout: 10000 }
		)
			.should("be.visible")
			.clear()
			.type(amount.toString())
			.blur();
		cy.wait(500);
	}

	removeCardFromPayment(cardIndex: number) {
		cy.get(`#selected-cards`).find(`.remove-card-btn`).eq(cardIndex).click();
		cy.wait(300);
	}

	verifyPaymentSummaryVisible() {
		cy.get("#payment-summary").should("be.visible");
	}

	verifyRemainingAmount(expectedAmount: string) {
		cy.get("#remaining-amount").should("contain", expectedAmount);
	}

	verifyPaymentDisabledWarning() {
		cy.get("#payment-disabled-warning").should("be.visible");
	}

	verifyPaymentControlsDisabled() {
		cy.get("#card-selector").should("be.disabled");
		cy.get("#add-card-to-payment").should("be.disabled");
	}

	getItemsSubtotal() {
		return cy
			.get("#items-subtotal")
			.invoke("text")
			.then((text) => text.trim());
	}

	getFreightValue() {
		return cy
			.get("#freight-value")
			.invoke("text")
			.then((text) => text.trim());
	}

	getCouponDiscount() {
		return cy
			.get("#coupons-discount")
			.invoke("text")
			.then((text) => text.trim());
	}

	getTotalAmount() {
		return cy
			.get("#total-display")
			.invoke("text")
			.then((text) => text.trim());
	}

	verifyTotalAmount(expectedTotal: string) {
		cy.get("#total-display").should("contain", expectedTotal);
	}

	submitCheckout() {
		this.clickButton("finish-order-btn");
	}

	fillCompleteCheckout(addressId: string, cardId: string) {
		this.selectDeliveryAddress(addressId);
		this.selectAndAddCard(cardId);

		cy.wait(500);

		this.getTotalAmount().then((totalText) => {
			const totalValue = this.parseMoneyValue(totalText);
			this.updateCardAmount(0, totalValue);
		});
	}

	fillCheckoutWithCoupons(
		addressId: string,
		cardId: string,
		promotionalCoupon?: string,
		exchangeCoupons?: string[]
	) {
		this.selectDeliveryAddress(addressId);

		if (promotionalCoupon) {
			this.selectPromotionalCoupon(promotionalCoupon);
		}

		if (exchangeCoupons && exchangeCoupons.length > 0) {
			exchangeCoupons.forEach((coupon) => {
				this.selectExchangeCoupon(coupon);
			});
		}

		this.applyCoupons();
		cy.wait(500);

		this.getTotalAmount().then((totalText) => {
			const totalValue = this.parseMoneyValue(totalText);

			if (totalValue > 0) {
				this.selectAndAddCard(cardId);
				cy.wait(300);
				this.updateCardAmount(0, totalValue);
			}
		});
	}

	fillCheckoutWithMultipleCards(
		addressId: string,
		cards: Array<{ cardId: string; amount: number }>
	) {
		this.selectDeliveryAddress(addressId);

		cards.forEach((card, index) => {
			this.selectAndAddCard(card.cardId);
			cy.wait(300);
			this.updateCardAmount(index, card.amount);
		});
	}

	verifyValidationError(errorMessage: string) {
		cy.get(".swal2-container").should("exist");
		cy.get(".swal2-title").should("contain", "Dados Incompletos");
		cy.get(".swal2-html-container").should("contain", errorMessage);
	}

	verifySuccessModal() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-success").should("be.visible");
		cy.get(".swal2-title").should("contain", "Sucesso!");
	}

	verifyErrorModal() {
		cy.get(".swal2-container", { timeout: 10000 }).should("be.visible");
		cy.get(".swal2-icon-error").should("be.visible");
	}

	closeModal() {
		cy.get(".swal2-confirm").click();
	}

	waitForSuccessModalAndClose() {
		this.verifySuccessModal();
		cy.wait(500);
		this.closeModal();
		cy.wait(500);
	}

	clickAddAddressButton() {
        cy.get("#add-address")
			.should("be.visible")
			.should("not.be.disabled");

		cy.wait(1000);
                
        cy.get("#add-address").click({ force: true });
		cy.wait(500);
	}

	fillAddressModalForm(addressData: {
		cep: string;
		number: string;
		streetName: string;
		neighborhood: string;
		city: string;
		shortPhrase: string;
		residenceType: string;
		streetType: string;
		state: string;
		type: string;
		observation?: string;
	}) {
		cy.get("#address-modal-container", { timeout: 5000 }).should("be.visible");

		cy.get("#address-zip-code").clear().type(addressData.cep);
		cy.wait(2000);

		cy.get("#address-number").clear().type(addressData.number);
		cy.get("#address-street-name").clear().type(addressData.streetName);
		cy.get("#address-neighborhood").clear().type(addressData.neighborhood);
		cy.get("#address-city").clear().type(addressData.city);
		cy.get("#address-short-phrase").clear().type(addressData.shortPhrase);

		if (addressData.observation) {
			cy.get("#address-observation").clear().type(addressData.observation);
		}

		cy.get("#address-residence-type").select(addressData.residenceType);
		cy.get("#address-street-type").select(addressData.streetType);
		cy.get("#address-state").select(addressData.state);
		cy.get("#address-type").select(addressData.type);
	}

	submitAddressModal() {
		cy.get("#newAddress").click();
		cy.wait(1000);
	}

	createAddressInline(addressData: any) {
		this.clickAddAddressButton();
		this.fillAddressModalForm(addressData);
		this.submitAddressModal();
		this.waitForSuccessModalAndClose();
	}

	clickAddCardButton() {
		cy.get("#add-payment").click();
		cy.wait(500);
	}

	fillCardModalForm(cardData: {
		number: string;
		cvv: string;
		impressName: string;
		flag: string;
		isPreferred: boolean;
	}) {
		// Aguardar modal abrir - ID correto é modal-container
		cy.get("#modal-container", { timeout: 5000 }).should("be.visible");

		// Preencher campos do cartão
		cy.get("#card-number").clear().type(cardData.number);
		cy.get("#card-cvv").clear().type(cardData.cvv);
		cy.get("#card-impress-name").clear().type(cardData.impressName);
		cy.get("#card-flag").select(cardData.flag);

		if (cardData.isPreferred) {
			cy.get("#card-is-preferred").check({ force: true });
		}
	}

	submitCardModal() {
		cy.get("#newCard").click();
		cy.wait(1000);
	}

	createCardInline(cardData: any) {
		this.clickAddCardButton();
		this.fillCardModalForm(cardData);
		this.submitCardModal();
		this.waitForSuccessModalAndClose();
	}

	private parseMoneyValue(moneyString: string): number {
		if (!moneyString) return 0;
		return (
			parseFloat(
				moneyString
					.replace(/R\$/g, "")
					.replace(/\s/g, "")
					.replace(/\./g, "")
					.replace(",", ".")
			) || 0
		);
	}

	verifyCheckoutFormExists() {
		cy.get("form").should("exist");
	}

	verifyFinishOrderButtonExists() {
		cy.get("#finish-order-btn").should("exist").and("be.visible");
	}
}
