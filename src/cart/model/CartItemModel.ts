import { Column, Entity, ManyToOne } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import { CartItem } from "../domain/CartItem";
import ClientModel from "../../client/model/ClientModel";
import BookModel from "../../books/model/BookModel";

@Entity("CART_ITEMS")
export default class CartItemModel extends GenericModel {
	@ManyToOne(() => ClientModel, { eager: true })
	client: ClientModel;

	@ManyToOne(() => BookModel, { eager: true })
	book: BookModel;

	@Column({ type: "int", default: 1 })
	quantity: number;

	public constructor(
		client: ClientModel,
		book: BookModel,
		quantity: number,
		isActive: boolean
	) {
		super();
		this.client = client;
		this.book = book;
		this.quantity = quantity;
		this.isActive = isActive;
	}

	toEntity(): CartItem {
		const cartItem = new CartItem(
			this.client.toEntity(),
			this.book.toEntity(),
			this.quantity
		);
		cartItem.id = this.id;
		return cartItem;
	}

	static fromEntity(cartItem: CartItem): CartItemModel {
		return new CartItemModel(
			ClientModel.fromEntity(cartItem.client),
			BookModel.fromEntity(cartItem.book),
			cartItem.quantity,
			cartItem.isActive
		);
	}
}
