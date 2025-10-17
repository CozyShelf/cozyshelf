import AddCartItensPageObject from "../../support/pages/cart/AddCartItensPageObject";
import CartManagementPageObject from "../../support/pages/cart/CartManagementPageObject";

describe("coupon management", () => {
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
		cartManagementPageObject.visitCartPage();
	});

	it("should apply promotional coupon and update total", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectPromotionalCoupon("PROMO10");
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.verifyAppliedCouponsStatus();
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should apply exchange coupon and update total", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectExchangeCoupon("TROCA002");
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.verifyAppliedCouponsStatus();
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should apply both promotional and exchange coupons", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectPromotionalCoupon("PROMO10");
			cartManagementPageObject.selectExchangeCoupon("TROCA002");
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.verifyAppliedCouponsStatus();
			cartManagementPageObject.getCartTotal().should("not.eq", initialTotal);
		});
	});

	it("should reset coupons and restore original total", () => {
		cartManagementPageObject.getCartTotal().then((initialTotal) => {
			cartManagementPageObject.selectPromotionalCoupon("PROMO10");
			cartManagementPageObject.applyCoupons();
			cartManagementPageObject.resetCoupons();
			cartManagementPageObject.getCartTotal().should("eq", initialTotal);
		});
	});
});
