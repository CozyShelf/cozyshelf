import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class CannotRemoveLastPreferredCard extends DomainException {
	constructor() {
		super(
			"Não é possível remover o status de preferencial do único cartão marcado como preferencial."
		);
	}
}
