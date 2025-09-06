import ICardFlagData from "./ICardFlagData";

export default interface ICardData {
	number: string;
	nameOnCard: string;
	cvv: string;
	expiryDate: Date;
	isPreferred: boolean;
	cardFlag: ICardFlagData;
}
