import Order from "../domain/Order";
import OrderStatus from "../domain/enums/OrderStatus";

export default class OrderListDTO {
    public readonly id: string;
    public readonly estimatedDeliveryDate: Date;
    public readonly status: OrderStatus;

    constructor(
        id: string,
        estimatedDeliveryDate: Date,
        status: OrderStatus
    ) {
        this.id = id;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.status = status;
    }

    public static fromEntity(order: Order): OrderListDTO {
        return new OrderListDTO(
            order.id,
            order.delivery.deliveryDate,
            order.orderStatus
        );
    }
}