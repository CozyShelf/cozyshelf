import CartManagementPageObject from "../../support/pages/cart/CartManagementPageObject";
import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";

describe("cart management", () => {
	let cartManagementPageObject: CartManagementPageObject;
	let addCartItensPageObject: AddCartItensPageObject;
	const bookId = "da27ae01-0bc9-4509-97bd-2e1eb4fe8dab";

	const makeSUT = () => {
		addCartItensPageObject = new AddCartItensPageObject();
		cartManagementPageObject = new CartManagementPageObject(
			addCartItensPageObject
		);
	};

	beforeEach(() => {
		makeSUT();
		cartManagementPageObject.visitCartPage();
	});

	it("should display books added to cart", () => {
		cartManagementPageObject.verifyIfBookIsInCart(bookId);
	});

	it("should correctly remove an item from cart", () => {
		cartManagementPageObject.verifyIfBookIsInCart(bookId);
		cartManagementPageObject.removeBookFromCart(bookId);
		cartManagementPageObject.verifyRemovalConfirmationModal();
	});

	it("should allow updating book quantity", () => {
		const newQuantity = 3;
		cartManagementPageObject.updateBookQuantity(bookId, newQuantity);

		cy.wait(1000);

		cartManagementPageObject.getCartTotal().then((total) => {
			const initialTotal = total;
			cartManagementPageObject.increaseBookQuantity(bookId);
			cy.wait(1000);
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should correctly show the empty cart message", () => {
		cartManagementPageObject.verifyIfBookIsInCart(bookId);

		cartManagementPageObject.removeBookFromCart(bookId);
		cartManagementPageObject.verifyRemovalConfirmationModal();

		cy.wait(1000);
		cartManagementPageObject.verifyIfCartIsEmpty();
	});
});
