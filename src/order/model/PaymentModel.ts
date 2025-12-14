import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import Payment from "../domain/Payment";
import OrderModel from "./OrderModel";
import PaymentCardModel from "./PaymentCardModel";

@Entity()
export default class PaymentModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2, name: "total_amount" })
    totalAmount!: number;

    @OneToOne(() => OrderModel, order => order.payment)
    @JoinColumn({ name: "order_id" })
    order!: OrderModel;

    @OneToMany(() => PaymentCardModel, paymentCard => paymentCard.payment, { cascade: true, eager: true })
    paymentCards!: PaymentCardModel[];

    constructor(
        totalAmount?: number,
        paymentCards?: PaymentCardModel[]
    ) {
        super();
        if (totalAmount !== undefined) {
            this.totalAmount = totalAmount;
        }
        // NÃO inicializar arrays aqui - TypeORM cuida disso
        if (paymentCards) {
            this.paymentCards = paymentCards;
        }
    }

    public toEntity(): Payment {
        const payment = new Payment(
            this.totalAmount,
            this.paymentCards?.map(pc => pc.toEntity()) || []
        );

        payment.id = this.id;
        payment.isActive = this.isActive;

        return payment;
    }

    public static fromEntity(payment: Payment): PaymentModel {
        const model = new PaymentModel();

        model.totalAmount = payment.totalAmount;
        model.isActive = payment.isActive;

        if (payment.id) {
            model.id = payment.id;
        }

        if (payment.paymentCard) {
            model.paymentCards = payment.paymentCard.map(pc => PaymentCardModel.fromEntity(pc));
        }

        return model;
    }
}
