import ICardFlagData from "./ICardFlagData";

export default interface ICardData {
	number: string;
	nameOnCard: string;
	cvv: string;
	isPreferred: boolean;
	cardFlag: ICardFlagData;
}
