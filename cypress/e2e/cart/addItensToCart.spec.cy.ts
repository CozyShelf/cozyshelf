import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";
import CartManagementPageObject from "../../support/pages/cart/CartManagementPageObject";

describe("add items to cart", () => {
	let addCartItensPageObject: AddCartItensPageObject;
	let cartManagementPageObject: CartManagementPageObject;

	const makeSUT = () => {
		addCartItensPageObject = new AddCartItensPageObject();
		cartManagementPageObject = new CartManagementPageObject(
			addCartItensPageObject
		);
	};

	beforeEach(() => {
		makeSUT();
	});

	it("should add a book to the cart from the book details page", () => {
		addCartItensPageObject.visitBookDetailsPage();
		addCartItensPageObject.addBookToCart();
		addCartItensPageObject.verifyIfSuccessNotificationAppears();
	});

	it("should add many books to the cart from the book details page", () => {
		addCartItensPageObject.visitBookDetailsPage();
		addCartItensPageObject.addManyBooksToCart(3);
		addCartItensPageObject.verifyIfSuccessNotificationAppears();
	});

	it("should add a book to the cart from the list all books page", () => {
		addCartItensPageObject.visitListAllBooksPage();
		addCartItensPageObject.addBookToCart();
		addCartItensPageObject.verifyIfSuccessNotificationAppears();
	});

	it("should show added books in the cart page", () => {
		addCartItensPageObject.visitBookDetailsPage();
		addCartItensPageObject.addBookToCart();
		addCartItensPageObject.verifyIfSuccessNotificationAppears();

		cartManagementPageObject.visitCartPage();

		cartManagementPageObject.verifyIfBookIsInCart(
			"da27ae01-0bc9-4509-97bd-2e1eb4fe8dab"
		);
	});
});
