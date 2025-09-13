import DomainException from "../../../generic/domain/exceptions/DomainException";

export class AddressCantBeRemoved extends DomainException {
	constructor() {
		super("O endereço não pode ser removido. Um cliente deve possuir ao menos um endereço de entrega e cobrança ativo.");
	}
}
