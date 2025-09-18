import ITelephoneData from "../../telephone/types/ITelephoneData";
import Gender from "../domain/enums/Gender";

export default interface IUpdateClientData {
	name?: string;
	birthDate?: Date;
	cpf?: string;
	email?: string;
	gender?: Gender;
	telephone?: ITelephoneData;
}
