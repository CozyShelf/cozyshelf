import DomainEntity from "../../generic/domain/DomainEntity";
import { PaymentCard } from "./PaymentCard";

export default class Payment extends DomainEntity{
    _totalAmount!: number;
    _paymentCard?: PaymentCard[];

    constructor(
        amount: number, 
        paymentCard?: PaymentCard[]
    ) {
        super();
        this._totalAmount = amount;
        this._paymentCard = paymentCard;
    }

    get totalAmount(): number {
        return this._totalAmount;
    }

    get paymentCard(): PaymentCard[] | undefined {
        return this._paymentCard;
    }

    static fromRequestData(data: any): Payment {
        console.log("payment controller: ", data);
        const payment = new Payment(
            data.totalAmount,
            data.cards.map((cardData: any) => PaymentCard.fromRequestData(cardData))
        );

        return payment;
    }
}