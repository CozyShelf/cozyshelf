import OrderStatus from "../domain/enums/OrderStatus";

export interface IOrderItemData {
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    bookPrice: number;
    quantity: number;
    subtotal: number;
}

export interface IDeliveryData {
    addressId: string;
    addressShortPhrase: string;
    addressFullAddress: string;
    freightType: string; // "PAC" | "SEDEX"
    freightPrice: number;
    estimatedDeliveryDate: Date;
    trackingCode?: string;
}

export interface IPaymentData {
    totalAmount: number;
    finalAmount: number;
    totalDiscounts: number;
    creditCards: {
        id: string;
        maskedNumber: string;
        cardFlag: string;
        isPreferred: boolean;
    }[];
    promotionalCoupon?: {
        id: string;
        codigo: string;
        valor: number;
        validade: Date;
        isValid: boolean;
    };
    discountCoupons: {
        id: string;
        codigo: string;
        valor: number;
        isValid: boolean;
    }[];
}

export default interface IOrderData {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    observations?: string;
    
    // Valores calculados
    itemsSubtotal: number;
    deliveryTotal: number;
    totalDiscounts: number;
    totalValue: number;
    totalItemsQuantity: number;
    
    // Dados detalhados
    items: IOrderItemData[];
    delivery: IDeliveryData;
    payment: IPaymentData;
    
    // Status de acompanhamento
    canBeCancelled: boolean;
    isDelivered: boolean;
    isLate: boolean;
    
    // Histórico de status (opcional)
    statusHistory?: {
        status: OrderStatus;
        date: Date;
        description?: string;
    }[];
}