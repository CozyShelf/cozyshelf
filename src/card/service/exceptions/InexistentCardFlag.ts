export default class InexistentCardFlag extends Error {
	constructor(flagDescription: string) {
		super(`A bandeira de descrição: ${flagDescription} não foi encontrada!`);
		this.name = "InexistentCardFlag";
	}
}
