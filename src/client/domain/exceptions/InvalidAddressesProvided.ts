import AddressType from "../../../address/domain/enums/AddressType";
import DomainException from "../../../generic/domain/exceptions/DomainException";

export default class InvalidAddressesProvided extends DomainException {
	constructor(addressType: AddressType) {
		super(`At least one "${addressType}" address must be provided`);
	}
}
