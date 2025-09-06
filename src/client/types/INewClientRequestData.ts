import IAddressData from "../../address/types/IAddressData";
import ICardData from "../../card/types/ICardData";
import IClientData from "./IClientData";

export default interface INewClientInputData {
	clientData: IClientData;
	addresses: IAddressData[];
	cards: ICardData[];
}
