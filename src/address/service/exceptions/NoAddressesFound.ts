export default class NoAddressesFound extends Error {
	constructor() {
		super("Nenhum endereço foi encontrado!");
		this.name = "NoAddressesFound";
	}
}
