import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import { PaymentCard } from "../domain/PaymentCard";
import PaymentModel from "./PaymentModel";
import CreditCardModel from "../../card/model/CreditCardModel";

@Entity()
export default class PaymentCardModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount!: number;

    @ManyToOne(() => CreditCardModel)
    @JoinColumn({ name: "card_id" })
    card!: CreditCardModel;

    @ManyToOne(() => PaymentModel, payment => payment.paymentCards)
    @JoinColumn({ name: "payment_id" })
    payment!: PaymentModel;

    public toEntity(): PaymentCard {
        const paymentCard = new PaymentCard(
            this.card.id,
            this.amount
        );

        paymentCard.id = this.id;
        paymentCard.isActive = this.isActive;

        return paymentCard;
    }

    public static fromEntity(paymentCard: PaymentCard): PaymentCardModel {
        const model = new PaymentCardModel();
        
        if (paymentCard.id) {
            model.id = paymentCard.id;
        }

        model.amount = paymentCard.amount;
        model.card = { id: paymentCard.cardId } as CreditCardModel;
        model.isActive = paymentCard.isActive;

        return model;
    }
}