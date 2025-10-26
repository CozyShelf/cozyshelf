import CartService from "../../cart/service/CartService";
import { CouponService } from "../../coupons/service/CouponsService";
import OrderDAO from "../dao/typeORM/OrderDAO";
import Order from "../domain/Order";
import OrderModel from "../model/OrderModel";

export class OrderService {
    constructor(
        private readonly orderDAO: OrderDAO,
        private readonly cartService: CartService,
        private readonly couponService: CouponService
    ) {}

    public async create(order: Order): Promise<Order> {
        const orderModel = OrderModel.fromEntity(order);

        // Validate coupons before creating the order
        await this.validateCouponsForOrder(orderModel);

        const exceeds = await this.couponsTotalValueExceedsOrderTotal(order.discount, orderModel);

        if (exceeds) {
            this.couponService.createExchangeCouponForExcessValue(
                order.clientId,
                order.discount - (Number(order.itemSubTotal) + Number(order.freight.value))
            );
				}

			const createdOrderModel = await this.orderDAO.save(orderModel);

        const createdOrder = createdOrderModel.toEntity();

        await this.markCouponsAsUsed(createdOrder);

        this.cartService.clearCart(createdOrder.clientId);

        return createdOrder;
    }

    public async getById(id: string): Promise<Order | null> {
			const orderModel = await this.orderDAO.findById(id);

        if (!orderModel) {
            return null;
        }
        return orderModel.toEntity();
    }

    private async couponsTotalValueExceedsOrderTotal(totalCouponsValue: number, order: OrderModel): Promise<boolean> {
        return totalCouponsValue > (Number(order.itemSubTotal) + Number(order.freight.value));
    }

    private async validateCouponsForOrder(order: OrderModel): Promise<void> {
        if (order.promotionalCouponId) {
            await this.couponService.validateCouponsAndVerifyValidity([order.promotionalCouponId]);
        }

        if (order.exchangeCouponIds && order.exchangeCouponIds.length > 0) {
            await this.couponService.validateCouponsAndVerifyValidity(order.exchangeCouponIds);
        }
    }

    private async markCouponsAsUsed(order: Order): Promise<void> {

        if (order.promotionalCouponId) {
            await this.couponService.markAsUsed([order.promotionalCouponId], order.id);
        }

        if (order.exchangeCouponsIds && order.exchangeCouponsIds.length > 0) {
            await this.couponService.markAsUsed(order.exchangeCouponsIds, order.id);
        }
    }

    public async getAll(): Promise<Order[]> {
        const orderModels = await this.orderDAO.findAll();
        if (!orderModels) {
            return [];
        }
        return orderModels.map(orderModel => orderModel.toEntity());
    }
}
