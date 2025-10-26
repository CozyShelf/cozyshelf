export default class CouponAlreadyUsed extends Error {
    public constructor(couponId: string) {
        super(`Cupom já utilizado! O cupom com ID ${couponId} já foi usado em outro pedido.`);
    }
}