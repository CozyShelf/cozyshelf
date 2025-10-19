import { Request, Response } from "express";
import CartService from "../service/CartService";
import INewCartItemRequestData from "../types/INewCartItemRequestData";
import CartItemListDTO from "../dto/CartItemListDTO";
import { AddressService } from "../../address/service/AddressService";
import { CardService } from "../../card/service/CardService";
import AddressListDTO from "../../address/dto/AddressListDTO";
import CardListDTO from "../../card/dto/CardListDTO";
import { brazilStates } from "../../generic/config/database/seeders/address/states";
import { CouponService } from "../../coupons/service/CouponsService";
import { CouponType } from "../../coupons/domain/enums/CouponType";
import { FreightService } from "../../freight/service/FreightService";

export default class CartController {

	public constructor(
		private service: CartService,
		private cardService: CardService,
		private addressService: AddressService,
		private couponService: CouponService,
		private freightService: FreightService
	)
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

    // Calcular quantidade total de itens
    const totalItems = cartItemsListDTO.reduce((total, item) => total + item.quantity, 0);
    
    let itemsSubtotal = 0;
    cartItemsListDTO.forEach((item) => (itemsSubtotal += item.subtotal));

    const promotionalCoupons = await this.couponService.getValidCouponsByClientAndType(clientID, CouponType.PROMOTIONAL)
    const exchangeCoupons = await this.couponService.getValidCouponsByClientAndType(clientID, CouponType.EXCHANGE)

    const cardsEntities = await this.cardService.getByClientId(clientID);
    const addressesEntities = await this.addressService.getByClientId(clientID);

    const cards = cardsEntities.map((card) => CardListDTO.fromEntity(card));
    const addresses = addressesEntities.map((address) =>
        AddressListDTO.fromEntity(address)
    );

    const addressesWithFreight = addresses.map(address => {
        const freightValue = this.freightService.calculateFreightValue(address.state, totalItems);
        return {
            ...address,
            freightValue: freightValue,
            freightFormatted: `R$ ${freightValue.toFixed(2).replace(".", ",")}`
        };
    });

    const defaultFreight = 0;
    
    res.render("shoppingCart", {
        title: "Carrinho de Compras",
        currentHeaderTab: "cart",
        layout: "defaultLayout",
        cartItems: cartItemsListDTO,
        promotionalCoupons,
        exchangeCoupons,
        itemsSubtotal: `R$ ${itemsSubtotal.toFixed(2).replace(".", ",")}`,
        freight: `R$ ${defaultFreight.toFixed(2).replace(".", ",")}`,
        total: `R$ ${(itemsSubtotal + defaultFreight).toFixed(2).replace(".", ",")}`,
        totalItems,
        cards,
        addresses: addressesWithFreight, // Endereços já com frete calculado
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
