import DomainEntity from "../../generic/domain/DomainEntity";

export class PaymentCard extends DomainEntity {
    _cardId: string;
    _amount: number;
    
    constructor(cardId: string, amount: number) {
        super();
        this._cardId = cardId;
        this._amount = amount;
    }

    get cardId(): string {
        return this._cardId;
    }
    
    get amount(): number {
        return this._amount;
    }

    static fromRequestData(data: any): PaymentCard {
        return new PaymentCard(
            data.cardId,
            data.amount
        );
    }
}