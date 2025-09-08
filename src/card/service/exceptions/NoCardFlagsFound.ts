export default class NoCardFlagsFound extends Error {
	constructor() {
		super("Nenhuma bandeira de cartão foi encontrada!");
		this.name = "NoCardFlagsFound";
	}
}
