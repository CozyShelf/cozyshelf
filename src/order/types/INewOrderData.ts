export interface IOrderItemData {
    bookId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// Dados de entrega
export interface IDeliveryData {
    addressId: string;
}

// Dados de pagamento
export interface IPaymentData {
    cards?: ICrediCardData[];
    totalAmount: number;
}
export interface ICrediCardData {
    cardId: string;
    amount: number;
}

// Dados cupons
export interface ICouponsData {
    promotionalCoupon?: IPromotionalCouponData;
    exchangeCoupons?: IExchangeCouponData[];
}

export interface IPromotionalCouponData {
    code: string;
    discount: number;
}

export interface IExchangeCouponData {
    code: string;
    value: number;
}

export interface IOrderData{
    items: IOrderItemData[];
    totals: ICalculatedOrderItemData;
}

export interface ICalculatedOrderItemData {
    itemsSubtotal: number;
    freight: number;
    discount: number;
    finalTotal: number;
}

// Dados para criar um novo pedido
export default interface INewOrderData {
    card: IOrderData;
    delivery: IDeliveryData;
    payment: IPaymentData;
    coupons?: ICouponsData;
    clientId: string;
}