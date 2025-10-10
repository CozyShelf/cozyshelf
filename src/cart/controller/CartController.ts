import { Request, Response } from "express";
import CartService from "../service/CartService";
import INewCartItemRequestData from "../types/INewCartItemRequestData";
import CartItemListDTO from "../dto/CartItemListDTO";
import { AddressService } from "../../address/service/AddressService";
import { CardService } from "../../card/service/CardService";
import AddressListDTO from "../../address/dto/AddressListDTO";
import CardListDTO from "../../card/dto/CardListDTO";
import { brazilStates } from "../../generic/config/database/seeders/address/states";

export default class CartController {
	private DEFAULT_FREIGHT_VALUE = 10;
	private MOCK_PROMOTIONAL_COUPONS = [
		{ code: "PROMO10", name: "Desconto de Primavera", discount: 10 },
		{ code: "WELCOME15", name: "Boas-vindas", discount: 15 },
		{ code: "BLACKFRIDAY", name: "Black Friday", discount: 25 },
	];
	private MOCK_EXCHANGE_COUPONS = [
		{ code: "TROCA001", name: "Cupom de Troca #001", value: "15,00" },
		{ code: "TROCA002", name: "Cupom de Troca #002", value: "25,50" },
		{ code: "TROCA003", name: "Cupom de Troca #003", value: "10,00" },
		{ code: "TROCA004", name: "Cupom de Troca #004", value: "30,00" },
	];

	public constructor(
		private service: CartService,
		private cardService: CardService,
		private addressService: AddressService
	) /* private couponService: CouponService */
	{}

	public async addItemToCart(req: Request, res: Response) {
		try {
			const body = req.body as INewCartItemRequestData;

			const createdCartItem = await this.service.addItemToCart(body);

			res.status(201).json({
				message: `Item adicionado com sucesso ao carrinho!`,
				createdCartItem: CartItemListDTO.fromEntity(createdCartItem),
			});
		} catch (error) {
			this.createErrorResponse(res, error as Error);
		}
	}

	public async getAllCartItemsByClientId(req: Request, res: Response) {
		try {
			const { clientID } = req.params;

			const foundCartItems = await this.service.findAllCartItems(clientID);
			const foundCartItemsDTO = foundCartItems.map((cartItem) =>
				CartItemListDTO.fromEntity(cartItem)
			);

			res.status(200).json({
				message: `${foundCartItems.length} items econtrados`,
				count: foundCartItems.length,
				data: foundCartItemsDTO,
			});
		} catch (error) {
			this.createErrorResponse(res, error as Error);
		}
	}

	async renderBooksForCart(req: Request, res: Response) {
		const { clientID } = req.params;

		const cartBooks = await this.service.findAllCartItems(clientID);
		const cartItemsListDTO = cartBooks
			? CartItemListDTO.fromEntityList(cartBooks)
			: [];

		const freight = this.DEFAULT_FREIGHT_VALUE;

		let itemsSubtotal = 0;
		cartItemsListDTO.forEach((item) => (itemsSubtotal += item.subtotal));

		// TODO: change mocks for actual cupons using couponService with clientID

		const promotionalCoupons = this.MOCK_PROMOTIONAL_COUPONS;
		// const promotionalCoupons = this.couponService.getByClientID(clientID);

		const exchangeCoupons = this.MOCK_EXCHANGE_COUPONS;
		// const exchangeCoupons = this.couponService.getByClientID(clientID);

		const cardsEntities = await this.cardService.getByClientId(clientID);
		const addressesEntities = await this.addressService.getByClientId(clientID);

		const cards = cardsEntities.map((card) => CardListDTO.fromEntity(card));
		const addresses = addressesEntities.map((address) =>
			AddressListDTO.fromEntity(address)
		);

		res.render("shoppingCart", {
			title: "Carrinho de Compras",
			currentHeaderTab: "cart",
			layout: "defaultLayout",
			cartItems: cartBooks ? CartItemListDTO.fromEntityList(cartBooks) : [],
			promotionalCoupons,
			exchangeCoupons,
			itemsSubtotal: `R$ ${itemsSubtotal.toFixed(2).replace(".", ",")}`,
			freight: `R$ ${freight}`,
			total: `R$ ${(itemsSubtotal + freight).toFixed(2).replace(".", ",")}`,
			cards,
			addresses,
			states: brazilStates
		});
	}

	public async removeQuantityFromCart(req: Request, res: Response) {
		try {
			const body = req.body as {
				clientID: string;
				bookID: string;
				quantity: number;
			};

			const updatedCartItem = await this.service.removeQuantityFromCart(body);

			res.status(200).json({
				message: `Quantidade removida com sucesso!`,
				updatedCartItem,
			});
		} catch (error) {
			this.createErrorResponse(res, error as Error);
		}
	}

	public async removeCartItem(req: Request, res: Response) {
		try {
			const { itemId } = req.params;

			await this.service.removeCartItem(itemId);

			res.status(200).json({
				message: "Item removido com sucesso do carrinho!",
			});
		} catch (error) {
			this.createErrorResponse(res, error as Error);
		}
	}

	private createErrorResponse(res: Response, e: Error) {
		console.error("[ERROR] ❌ Erro na operação:", e.message);

		let statusCode = 400;

		res.status(statusCode).json({
			error: true,
			message: e.message,
			timestamp: new Date().toISOString(),
		});
	}
}
