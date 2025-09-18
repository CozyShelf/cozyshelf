import ICardFlagData from "./ICardFlagData";

export default interface IUpdateCardData {
	number?: string;
	nameOnCard?: string;
	cvv?: string;
	isPreferred?: boolean;
	cardFlag?: ICardFlagData;
}
