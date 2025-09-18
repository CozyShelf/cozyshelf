export default class NoCardFlagsFound extends Error {
	constructor(flagDescription?: string) {
		let message = flagDescription
			? `A bandeira de descrição: ${flagDescription} não foi encontrada!`
			: `Nenhuma bandeira de cartão foi encontrada`;

		super(message);
		this.name = "NoCardFlagsFound";
	}
}
