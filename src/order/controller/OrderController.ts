import { Request, Response } from "express";
import INewOrderData from "../types/INewOrderData";
import Order from "../domain/Order";
import { OrderService } from "../service/OrderService";
import BookService from "../../books/service/BookService";
import BookDetailsDTO from "../../books/dto/BookDetailsDTO";
import OrderStatus from "../domain/enums/OrderStatus";

export default class OrderController {
	private readonly service: OrderService;
	private readonly bookService: BookService;

	constructor(service: OrderService, bookService: BookService) {
		this.service = service;
		this.bookService = bookService;
	}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			const body = req.body as INewOrderData;
			const clientId = body.clientId;

			const order = Order.fromRequestData(body);
			const createdOrder = await this.service.create(order);
			console.log("[INFO] ✅ Order created successfully!");

			res.status(201).json({
				message: `Pedido ${createdOrder.id} criado com sucesso para o cliente de id: ${clientId}!`,
				orderId: createdOrder.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async updateStatus(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const newStatus = req.params.status as keyof typeof OrderStatus;

			console.log(`[INFO] 🔄 Atualizando status do pedido de id: ${id} para ${newStatus}...`);
			const updatedOrder = await this.service.updateStatus(id, newStatus);

			res.status(200).json({
				message: `Status do pedido atualizado para ${updatedOrder.orderStatus} com sucesso!`,
				orderId: updatedOrder.id,
				newStatus: updatedOrder.orderStatus,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	} 

	public async getById(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const order = await this.service.getById(id);
			if (!order) {
				res.status(404).json({
					message: `Pedido de id: ${id} não foi encontrado!`,
				});
				return;
			}
			res.status(200).json(order);
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderOrderDetails(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const order = await this.service.getById(id);

			if (!order) {
				res.status(404).json({message: `Pedido de id: ${id} não foi encontrado!`,});
				return;
			}

			const booksEntity = order?._items
				? await Promise.all(order._items.map((item) => this.bookService.getById(item._bookId)))
				: [];

			const books = booksEntity.map(book => book ? BookDetailsDTO.fromEntity(book) : null).filter(book => book !== null);

			res.render("orderDetails", {
				title: `Detalhes do Pedido ${order.id}`,
				currentHeaderTab: "profile",
				layout: "detailsLayout",
				currentUrl: "orders",
				order: order,
				books: books,
				isAdmin: false,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderOrdersTable(_: Request, res: Response): Promise<void> {
		try {
			const orders = await this.service.getAll();
			res.render("ordersTable", {
					title: "Meus Pedidos",
					currentHeaderTab: "profile",
					layout: "detailsLayout",
					currentUrl: "orders",
					orders: orders,
					isAdmin: false,
				});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderAdminOrdersTable(_: Request, res: Response): Promise<void> {
		try {
			const orders = await this.service.getAll();
			res.render("ordersTable", {
					title: "Pedidos",
					currentHeaderTab: "orders",
					layout: "defaultLayoutAdmin",
					currentUrl: "orders",
					orders: orders,
					isAdmin: true,
				});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderAdminOrderDetails(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const order = await this.service.getById(id);
			
			const booksEntity = order?._items
				? await Promise.all(order._items.map((item) => this.bookService.getById(item._bookId)))
				: [];

			const books = booksEntity.map(book => book ? BookDetailsDTO.fromEntity(book) : null).filter(book => book !== null);

			if (!order) {
				res.status(404).json({
					message: `Pedido de id: ${id} não foi encontrado!`,
				});
				return;
			}
			res.render("orderDetails", {
				title: `Detalhes do Pedido ${order.id}`,
				currentHeaderTab: "orders",
				layout: "defaultLayoutAdmin",
				currentUrl: "orders",
				order: order,
				books: books,
				isAdmin: true,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	private createErrorResponse(res: Response, e: Error) {
		console.error("[ERROR] ❌ Erro na operação:", e.message);

		let statusCode = 400;

		if (
			e.message.includes("não encontrado") ||
			e.message.includes("não foi encontrado")
		) {
			statusCode = 404;
		} else if (
			e.message.includes("já cadastrado") ||
			e.message.includes("já existe")
		) {
			statusCode = 409;
		} else if (
			e.message.includes("obrigatório") ||
			e.message.includes("inválido")
		) {
			statusCode = 422;
		}

		res.status(statusCode).json({
			error: true,
			message: e.message,
			timestamp: new Date().toISOString(),
		});
	}
}
