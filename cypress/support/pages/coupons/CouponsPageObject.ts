import GenericPageObject from "../GenericPageObject";

export default class CouponsPageObject extends GenericPageObject {
	private readonly COUPONS_PAGE = "http://localhost:3000/coupons";

	visitCouponsPage() {
		this.visitPage(this.COUPONS_PAGE);
	}

	verifyCouponsPageLoaded() {
		cy.url().should("include", "/coupons");
		cy.get("body").should("be.visible");
	}

	verifyExchangeCouponExists() {
		cy.contains("tbody tr span.bg-orange", "Troca", { timeout: 10000 })
			.should("exist")
			.and("be.visible");
	}

	verifyExchangeCouponWithValue(expectedValue: string) {
		cy.contains("tbody tr span.bg-orange", "Troca")
			.parents("tr")
			.within(() => {
				cy.get("td").eq(3).should("contain", expectedValue);
			});
	}

	getExchangeCouponId() {
		return cy
			.contains("tbody tr span.bg-orange", "Troca")
			.parents("tr")
			.find("td")
			.first()
			.invoke("text")
			.then((text) => text.trim());
	}

	verifyExchangeCouponHasExpirationDate() {
		cy.contains("tbody tr span.bg-orange", "Troca")
			.parents("tr")
			.within(() => {
				cy.get("td").eq(2).should("not.be.empty");
			});
	}
}
