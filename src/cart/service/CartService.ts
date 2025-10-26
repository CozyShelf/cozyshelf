import BookDAO from "../../books/dao/BookDAO";
import NoBooksFound from "../../books/service/exceptions/NoBooksFound";
// import InsufficientStockException from "../../books/service/exceptions/InsufficientStockException";
import BookService from "../../books/service/BookService";
import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import NoClientsFound from "../../client/service/exceptions/NoClientsFound";
import CartDAO from "../dao/CartDAO";
import { CartItem } from "../domain/CartItem";
import CartItemModel from "../model/CartItemModel";
import INewCartItemRequestData from "../types/INewCartItemRequestData";
import IRemoveCartItemRequestData from "../types/IRemoveCartItemRequestData";
import NoCartItemsFound from "./exceptions/NoCartItemsFound";

export default class CartService {
	public constructor(
		private dao: CartDAO,
		private clientDAO: ClientDAO,
		private bookDAO: BookDAO,
		private bookService: BookService
	) {}

	public async addItemToCart(newCartItemData: INewCartItemRequestData) {
		const { clientID, bookID, quantity } = newCartItemData;

		const foundClient = await this.clientDAO.findById(clientID);
		if (!foundClient) {
			throw new NoClientsFound(clientID);
		}

		const foundBook = await this.bookDAO.findById(bookID);
		if (!foundBook) {
			throw new NoBooksFound(bookID);
		}

		const existingCartItem = await this.checkForExistingCartItem(
			clientID,
			bookID
		);

		let cartItemModel: CartItemModel;

		if (existingCartItem) {
			const cartItemEntity = existingCartItem.toEntity();
			cartItemEntity.updateQuantity(quantity);

			existingCartItem.quantity = cartItemEntity.quantity;
			cartItemModel = existingCartItem;
		} else {
			cartItemModel = new CartItemModel(foundClient, foundBook, quantity, true);
		}

		const savedCartItem = await this.dao.save(cartItemModel);

		return savedCartItem.toEntity();
	}

	private async checkForExistingCartItem(clientID: string, bookID: string) {
		return await this.dao.findByClientAndBookID(clientID, bookID);
	}

	public async findAllCartItems(clientID: string): Promise<CartItem[]> {
		const foundClient = await this.clientDAO.findById(clientID);
		if (!foundClient) {
			throw new NoClientsFound(clientID);
		}

		const foundCartItems = await this.dao.findAllByClientID(clientID);
		if (!foundCartItems || foundCartItems.length === 0) {
			return [];
		}

		return foundCartItems.map((cartItemModel) => cartItemModel.toEntity());
	}

	public async removeQuantityFromCart(
		removeCartItemData: IRemoveCartItemRequestData
	) {
		const { clientID, bookID, quantity } = removeCartItemData;

		const foundClient = await this.clientDAO.findById(clientID);
		if (!foundClient) {
			throw new NoClientsFound(clientID);
		}

		const foundBook = await this.bookDAO.findById(bookID);
		if (!foundBook) {
			throw new NoBooksFound(bookID);
		}

		const existingCartItem = await this.checkForExistingCartItem(
			clientID,
			bookID
		);

		if (!existingCartItem) {
			throw new NoCartItemsFound(`Item não encontrado no carrinho`);
		}

		if (!existingCartItem.isActive) {
			throw new NoCartItemsFound(`Item não está ativo no carrinho`);
		}

		const cartItemEntity = existingCartItem.toEntity();
		let quantityToReturnToStock = quantity;

		if (quantity >= cartItemEntity.quantity) {
			quantityToReturnToStock = cartItemEntity.quantity;
			existingCartItem.isActive = false;
		} else {
			cartItemEntity.removeQuantity(quantity);
			existingCartItem.quantity = cartItemEntity.quantity;
		}

		return await this.dao.save(existingCartItem);
	}

	public async removeCartItem(itemId: string): Promise<void> {
		const cartItem = await this.dao.findById(itemId);
		if (!cartItem) {
			throw new NoCartItemsFound(`Item com ID ${itemId} não encontrado`);
		}

		if (!cartItem.isActive) {
			throw new Error("Item já foi removido do carrinho");
		}

		await this.dao.delete(itemId);
	}

	public async clearCart(clientID: string): Promise<void> {
		const cartItems = await this.dao.findAllByClientID(clientID);
		if (!cartItems || cartItems.length === 0) {
			return;
		}

		await this.dao.deleteAllByClientID(clientID);
	}
}
