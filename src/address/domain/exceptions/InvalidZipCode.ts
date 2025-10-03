import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidZipCode extends DomainException {
	constructor(invalidZipCode: string = "") {
		super(
			`CEP inválido! O CEP '${invalidZipCode}' não é válido. Utilize o formato: 00000-000.`
		);
	}
}
