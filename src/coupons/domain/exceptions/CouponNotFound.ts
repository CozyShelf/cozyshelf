export default class CouponNotFound extends Error {
    public constructor(couponId?: string) {
        const message = couponId
            ? `Cupom não encontrado! Nenhum cupom foi encontrado com o ID: ${couponId}`
            : `Nenhum cupom cadastrado! Não há cupons cadastrados na base de dados.`;

        super(message);
    }
}