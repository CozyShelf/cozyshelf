import AddressType from "../domain/enums/AddressType";
import IUpdateCountryData from "./INewCountryData";

export default interface IUpdateAddressData {
	shortPhrase?: string;
	zipCode?: string;
	streetType?: string;
	streetName?: string;
	number?: string;
	residenceType?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	country?: IUpdateCountryData;
	type?: AddressType;
	observation?: string;
}
