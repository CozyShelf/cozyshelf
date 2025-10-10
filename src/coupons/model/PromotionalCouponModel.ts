import { Entity, Column, ManyToOne, JoinColumn} from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import { PromotionalCoupon } from "../domain/PromotionalCoupon";
import ClientModel from "../../client/model/ClientModel";

@Entity()
export default class PromotionalCouponModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    valor!: number;

    @Column({ type: "date" })
    validade!: Date;

    @Column({ type: "varchar", length: 50, unique: true })
    codigo!: string;

    @ManyToOne(() => ClientModel)
    @JoinColumn({ name: "client_id" })
    client!: ClientModel;

    public toEntity(): PromotionalCoupon {
        return new PromotionalCoupon(
            this.valor,
            this.validade,
            this.codigo,
            this.client.toEntity()
        );
    }

    public static fromEntity(promotionalCoupon: PromotionalCoupon): PromotionalCouponModel {
        const model = new PromotionalCouponModel();
        model.valor = promotionalCoupon.valor;
        model.validade = promotionalCoupon.validade;
        model.codigo = promotionalCoupon.codigo;
        return model;
    }

    public updateFromEntity(promotionalCoupon: PromotionalCoupon): void {
        if (promotionalCoupon.isActive !== this.isActive) {
            this.isActive = promotionalCoupon.isActive;
        }
    }
}