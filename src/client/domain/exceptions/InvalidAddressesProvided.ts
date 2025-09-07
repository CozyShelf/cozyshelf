import AddressType from "../../../address/domain/enums/AddressType";
import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidAddressesProvided extends DomainException {
	constructor(addressType: AddressType) {
		super(
			`É necessário o cadastro de ao menos um endereço de ${
				addressType == AddressType.BILLING ? "entrega" : "cobrança"
			}.`
		);
	}
}
