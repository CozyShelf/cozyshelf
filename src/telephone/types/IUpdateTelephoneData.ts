import TelephoneType from "../domain/enums/TelephoneType";

export default interface IUpdateTelephoneData {
	ddd?: string;
	number?: string;
	type?: TelephoneType;
}
