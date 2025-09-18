import IPasswordData from "../../password/types/IPasswordData";
import ITelephoneData from "../../telephone/types/ITelephoneData";
import Gender from "../domain/enums/Gender";

export default interface IClientData {
	name: string;
	birthDate: Date;
	cpf: string;
	email: string;
	password: IPasswordData;
	gender: Gender;
	telephone: ITelephoneData;
}
