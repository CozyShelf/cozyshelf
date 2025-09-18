import AddressType from "../domain/enums/AddressType";
import ICountryData from "./ICountryData";

export default interface IAddressData {
	zipCode: string;
	number: string;
	residenceType: string;
	streetName: string;
	streetType: string;
	neighborhood: string;
	shortPhrase: string;
	observation: string;
	city: string;
	state: string;
	country: ICountryData;
	type: AddressType;
}
