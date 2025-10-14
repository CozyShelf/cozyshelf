import GenericPageObject from "../GenericPageObject";

export default class AddCartItensPageObject extends GenericPageObject {
	private readonly LIST_ALL_BOOKS_PAGE: string;
	private readonly BOOK_DETAILS_PAGE: string;

	public constructor() {
		super();
		this.LIST_ALL_BOOKS_PAGE = "http://localhost:3000/books";
		this.BOOK_DETAILS_PAGE =
			"http://localhost:3000/books/da27ae01-0bc9-4509-97bd-2e1eb4fe8dab";
	}

	visitListAllBooksPage() {
		this.visitPage(this.LIST_ALL_BOOKS_PAGE);
	}

	visitBookDetailsPage() {
		this.visitPage(this.BOOK_DETAILS_PAGE);
	}

	addBookToCart() {
		this.clickButton("add-to-cart-button");
	}

	verifyIfSuccessNotificationAppears() {
		const notification = cy.get("#cart-success-notification");
		notification.should("exist");
		notification.should("be.visible");
		notification.should("contain", "Adicionado ao carrinho");
	}
}
