import { CartItem } from "../domain/CartItem";

export default class CartItemListDTO {
	public readonly id: string;
	public readonly bookId: string;
	public readonly bookCover: string;
	public readonly bookTitle: string;
	public readonly quantity: number;
	public readonly bookPrice: number;
	public readonly subtotal: number;

	public constructor(
		id: string,
		bookId: string,
		bookCover: string,
		bookTitle: string,
		quantity: number,
		bookPrice: number,
		subtotal: number
	) {
		this.id = id;
		this.bookId = bookId;
		this.bookCover = bookCover;
		this.bookTitle = bookTitle;
		this.quantity = quantity;
		this.bookPrice = bookPrice;
		this.subtotal = subtotal;
	}

	public static fromEntity(cartItem: CartItem) {
		return new CartItemListDTO(
			cartItem.id,
			cartItem.book.id,
			cartItem.book.coverPath,
			cartItem.book.name,
			Number(cartItem.quantity),
			typeof cartItem.book.price === "string"
				? parseFloat(cartItem.book.price)
				: cartItem.book.price,
			cartItem.subtotal
		);
	}

	public static fromEntityList(cartItemList: CartItem[]) {
		return cartItemList.map((cartItem) => CartItemListDTO.fromEntity(cartItem));
	}

	public get formattedPrice(): string {
		return `R$ ${(this.subtotal).toFixed(2).replaceAll(".", ",")}`;
	}

	public get formattedUnitPrice(): string {
		const bookPrice =
			typeof this.bookPrice === "string"
				? parseFloat(this.bookPrice)
				: this.bookPrice;

		return `R$ ${bookPrice.toFixed(2).replaceAll(".", ",")}`;
	}
}
