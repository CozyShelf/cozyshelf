import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";

describe("add items to cart", () => {
	let addCartItensPageObject: AddCartItensPageObject;

	const makeSUT = () => {
		addCartItensPageObject = new AddCartItensPageObject();
	};

	beforeEach(() => {
		makeSUT();
	});

	it("should add a book to the cart from the book details page", () => {
		addCartItensPageObject.visitBookDetailsPage();
		addCartItensPageObject.addBookToCart();
		addCartItensPageObject.verifyIfSuccessNotificationAppears();
	});

	it("should add a book to the cart from the list all books page", () => {
		addCartItensPageObject.visitListAllBooksPage();
		addCartItensPageObject.addBookToCart();
		addCartItensPageObject.verifyIfSuccessNotificationAppears();
	});
})
