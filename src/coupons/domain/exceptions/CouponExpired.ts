export default class CouponExpired extends Error {
    public constructor(expirationDate: Date) {
        const formattedDate = expirationDate.toLocaleDateString('pt-BR');
        super(`Cupom expirado! O cupom promocional selecionado expirou em ${formattedDate}.`);
    }
}