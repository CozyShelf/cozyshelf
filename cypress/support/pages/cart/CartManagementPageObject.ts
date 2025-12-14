import GenericPageObject from "../GenericPageObject";
import AddCartItensPageObject from "./AddCartItensPageObject";

export default class CartManagementPageObject extends GenericPageObject {
	private readonly CART_PAGE: string;
	private readonly BOOKS_TO_ADD = 3;

	public constructor(
		private readonly addItemToCartPageObject: AddCartItensPageObject
	) {
		super();
		this.CART_PAGE =
			"http://localhost:3000/shopping-cart/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";
	}

	visitCartPage() {
		this.addItemToCartPageObject.visitBookDetailsPage();
		this.addItemToCartPageObject.addManyBooksToCart(this.BOOKS_TO_ADD);
		this.visitPage(this.CART_PAGE);
	}

	removeBookFromCart(bookId: string) {
		cy.get(`#cart-item-${bookId} .remove-btn`).click();

		cy.get(".swal2-container").should("exist");
		cy.get(".swal2-container").should("have.class", "cart-remove-modal");
		cy.get(".swal2-confirm").click();
	}

	verifyRemovalConfirmationModal() {
		cy.get(".swal2-container").should("exist");
		cy.get(".swal2-container").should("have.class", "cart-remove-modal");
		cy.get(".swal2-title").should("contain", "Remover item?");
		cy.get(".swal2-container").should(
			"contain",
			"Tem certeza que deseja remover este item do seu carrinho?"
		);
	}

	verifyIfBookIsInCart(bookId: string) {
		cy.get(`#cart-item-${bookId}`).should("exist");
	}

	verifyIfCartIsEmpty() {
		cy.get("#empty-cart-title")
			.should("be.visible")
			.and("contain", "Seu carrinho está vazio");
		cy.get("#empty-cart-message")
			.should("be.visible")
			.and(
				"contain",
				"Parece que você ainda não adicionou nenhum livro ao seu carrinho"
			);
		cy.get("#explore-books-btn")
			.should("be.visible")
			.and("have.attr", "href", "/books")
			.and("contain", "Explorar Livros");
	}

	updateBookQuantity(bookId: string, quantity: number) {
		cy.get(`#cart-item-${bookId} .quantity-input`)
			.clear()
			.type(quantity.toString());
	}

	increaseBookQuantity(bookId: string) {
		cy.get(
			`#cart-item-${bookId} .quantity-btn[data-action="increase"]`
		).click();
	}

	getCartTotal() {
		return cy
			.get("#total-display")
			.invoke("text")
			.then((text) => text.trim());
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
		this.clickButton("apply-coupons");

		cy.get(".swal2-container", { timeout: 5000 }).should("be.visible");
		cy.get(".swal2-title").should("contain", "Cupons aplicados!");
		cy.get(".swal2-confirm").click();
		cy.wait(500);
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
}
