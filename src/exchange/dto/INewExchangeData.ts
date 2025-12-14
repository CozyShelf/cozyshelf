export default interface INewExchangeData {
    orderId: string;
    exchangeItems: {
        bookId: string;
        quantity: number;
        unitPrice: number;
        subTotal: number;
    }[];
}