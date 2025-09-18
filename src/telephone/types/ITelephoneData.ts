import TelephoneType from "../domain/enums/TelephoneType";

export default interface ITelephoneData {
	ddd: string;
	number: string;
	type: TelephoneType;
}
