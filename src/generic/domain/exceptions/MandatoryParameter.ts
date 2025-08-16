import DomainException from "./DomainException";

export default class MandatoryParameter extends DomainException {
	constructor(parameterName: string) {
		super(`The parameter "${parameterName}" is mandatory.`);
	}
}
