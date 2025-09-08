export default class AddressNotFound extends Error {
	constructor(addressId: string) {
		super(`Endereço com ID: ${addressId} não foi encontrado!`);
		this.name = "AddressNotFound";
	}
}
