import { __values } from "tslib";
import DomainEntity from "../../generic/domain/DomainEntity";
import OrderStatus from "./enums/OrderStatus";
import OrderItem from "./OrderItem";
import Payment from "./Payment";
import Delivery from "./Delivery";

export default class Order extends DomainEntity {
    _clientId!: string;
    _freight: number = 0;
    _itemSubTotal: number = 0;
    _discount: number = 0;
    _finalTotal: number = 0;
    _createdAt!: Date;
    
    _items!: OrderItem[];
    _orderStatus!: OrderStatus;
    _payment!: Payment;
    _delivery!: Delivery;

    _promotionalCouponCode?: string;
    _exchangeCoupons: string[] = [];

    constructor(        
        items: OrderItem[],
        itemSubTotal: number,
        freight: number,
        discount: number,
        finalTotal: number,
        clientId: string,
        delivery: Delivery,
        payment: Payment,
        promotionalCouponCode?: string,
        exchangeCoupons?: string[]
    ) {
        super();
        this._items = items;
        this._payment = payment;
        this._itemSubTotal = itemSubTotal;
        this._freight = freight;
        this._discount = discount;
        this._finalTotal = finalTotal;
        this._clientId = clientId;

        this._delivery = delivery;

        this._promotionalCouponCode = promotionalCouponCode;
        this._exchangeCoupons = exchangeCoupons || [];

        this._orderStatus = OrderStatus.PROCESSING;
        this._createdAt = new Date();
    }

    get clientId(): string {
        return this._clientId;
    }
    
    set clientId(value: string) {
        this._clientId = value;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    set items(value: OrderItem[]) {
        this._items = value;
    }

    get delivery(): Delivery {
        return this._delivery;
    }
    
    set delivery(value: Delivery) {
        this._delivery = value;
    }

    get orderStatus(): OrderStatus {
        return this._orderStatus;
    }

    set orderStatus(value: OrderStatus) {
        this._orderStatus = value;
    }   

    get payment(): Payment | undefined {
        return this._payment;
    }

    set payment(value: Payment) {
        this._payment = value;
    }

    get itemSubTotal(): number {
        return this._itemSubTotal;
    }
    
    set itemSubTotal(value: number) {
        this._itemSubTotal = value;
    }

    get freight(): number {
        return this._freight;
    }
    
    set freight(value: number) {
        this._freight = value;
    }
    
    get discount(): number {
        return this._discount;
    }
    set discount(value: number) {
        this._discount = value;
    }
    
    get finalTotal(): number {
        return this._finalTotal;
    }
    
    set finalTotal(value: number) {
        this._finalTotal = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get promotionalCouponCode(): string | undefined {
        return this._promotionalCouponCode;
    }

    set promotionalCouponCode(value: string | undefined) {
        this._promotionalCouponCode = value;
    }
    
    get exchangeCoupons(): string[] {
        return this._exchangeCoupons;
    }

    set exchangeCoupons(value: string[]) {
        this._exchangeCoupons = value;
    }

    static fromRequestData(data: any): Order {
        const order = new Order(
            data.cart.items.map((itemData: any) => OrderItem.fromRequestData(itemData)),
            data.cart.totals.itemsSubtotal || 0,
            data.cart.totals.freight || 0,
            data.cart.totals.discount || 0,
            data.cart.totals.finalTotal || 0,
            data.clientId,
            Delivery.fromRequestData(data.delivery),
            Payment.fromRequestData(data.payment),
            data.coupons?.promotional,
            data.coupons?.exchange || []
        );

        return order;
    }
}