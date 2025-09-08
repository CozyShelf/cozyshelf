import ICardFlagData from "./ICardFlagData";

export default interface IUpdateCardData {
	number?: string;
	nameOnCard?: string;
	cvv?: string;
	expiryDate?: Date;
	isPreferred?: boolean;
	cardFlag?: ICardFlagData;
}
