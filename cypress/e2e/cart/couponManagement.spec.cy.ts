import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";
import CartManagementPageObject from "../../support/pages/cart/CartManagementPageObject";

describe("coupon management", () => {
	let addCartItensPageObject: AddCartItensPageObject;
	let cartManagementPageObject: CartManagementPageObject;

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
		cartManagementPageObject = new CartManagementPageObject(
			addCartItensPageObject
		);
	};

	beforeEach(() => {
		makeSUT();
		cartManagementPageObject.visitCartPage();
	});

	it("should apply promotional coupon and update total", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.PROMO10);
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.verifyAppliedCouponsStatus();
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should apply exchange coupon and update total", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA002);
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.verifyAppliedCouponsStatus();
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should apply both promotional and exchange coupons", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.PROMO10);
			cartManagementPageObject.selectExchangeCoupon(EXCHANGE_COUPONS.TROCA002);
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.verifyAppliedCouponsStatus();
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should reset coupons and restore original total", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectPromotionalCoupon(PROMOTIONAL_COUPONS.PROMO10);
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.resetCoupons();
			cartManagementPageObject.getCartTotal().should("eq", initialTotal);
		});
	});
});
