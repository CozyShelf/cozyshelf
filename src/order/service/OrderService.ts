import BookService from "../../books/service/BookService";
import BookSaleService from "../../books/service/BookSaleService";
import CartService from "../../cart/service/CartService";
import { CouponService } from "../../coupons/service/CouponsService";
import OrderDAO from "../dao/typeORM/OrderDAO";
import OrderStatus from "../domain/enums/OrderStatus";
import Order from "../domain/Order";
import OrderModel from "../model/OrderModel";

export class OrderService {
	constructor(
		private readonly orderDAO: OrderDAO,
		private readonly cartService: CartService,
		private readonly couponService: CouponService,
		private readonly bookService: BookService,
		private readonly bookSaleService: BookSaleService
	) {}

	public async create(order: Order): Promise<Order> {
		const orderModel = OrderModel.fromEntity(order);

		await this.validateCouponsForOrder(orderModel);

		const exceeds = await this.couponsTotalValueExceedsOrderTotal(
			order.discount,
			orderModel
		);

		if (exceeds) {
			this.couponService.createExchangeCouponForExcessValue(
				order.clientId,
				order.discount -
					(Number(order.itemSubTotal) + Number(order.freight.value))
			);
		}

		for (const item of order.items) {
			const book = await this.bookService.getById(item.bookId);
			book.verifyStockAvailability(item.quantity);

			await this.bookService.decreaseBookStock(item.bookId, item.quantity);
		}

		const createdOrderModel = await this.orderDAO.save(orderModel);

		const createdOrder = createdOrderModel.toEntity();

		for (const item of order.items) {
			await this.bookSaleService.registerSale(
				item.bookId,
				item.quantity,
				item.unitPrice
			);
		}

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

	public async updateStatus(
		id: string,
		newStatus: keyof typeof OrderStatus
	): Promise<Order> {
		const orderModel = await this.orderDAO.findById(id);

		if (!orderModel) {
			throw new Error(`Order with id: ${id} not found.`);
		}

		if (orderModel.orderStatus === OrderStatus[newStatus]) {
			throw new Error(
				`Order with id: ${id} is already in status: ${newStatus}.`
			);
		}

		orderModel.orderStatus = OrderStatus[newStatus];
		const updatedOrderModel = await this.orderDAO.save(orderModel);
		return updatedOrderModel.toEntity();
	}

	private async couponsTotalValueExceedsOrderTotal(
		totalCouponsValue: number,
		order: OrderModel
	): Promise<boolean> {
		return (
			totalCouponsValue >
			Number(order.itemSubTotal) + Number(order.freight.value)
		);
	}

	private async validateCouponsForOrder(order: OrderModel): Promise<void> {
		if (order.promotionalCouponId) {
			await this.couponService.validateCouponsAndVerifyValidity([
				order.promotionalCouponId,
			]);
		}

		if (order.exchangeCouponIds && order.exchangeCouponIds.length > 0) {
			await this.couponService.validateCouponsAndVerifyValidity(
				order.exchangeCouponIds
			);
		}
	}

	private async markCouponsAsUsed(order: Order): Promise<void> {
		if (order.promotionalCouponId) {
			await this.couponService.markAsUsed(
				[order.promotionalCouponId],
				order.id
			);
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
		return orderModels.map((orderModel) => orderModel.toEntity());
	}
}
