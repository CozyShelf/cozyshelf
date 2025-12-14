import DomainEntity from "../../generic/domain/DomainEntity";

export class PaymentCard extends DomainEntity {
	_cardId: string;
	_cardFlag: string = "";
	_cardNumber: string = "";
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

    get cardFlag(): string {
        return this._cardFlag;
		}
    set cardFlag(flag: string) {
        this._cardFlag = flag;
		}

    get cardNumber(): string {
        return this._cardNumber;
    }
    set cardNumber(number: string) {
        this._cardNumber = number;
    }

    static fromRequestData(data: any): PaymentCard {
        return new PaymentCard(
            data.cardId,
            data.amount
        );
    }
}
