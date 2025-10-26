import { Entity, Column, TableInheritance, ManyToOne, JoinColumn } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import { CouponType } from "../domain/enums/CouponType";
import ClientModel from "../../client/model/ClientModel";
import { CouponEntity } from "../domain/CouponEntity";

@Entity()
@TableInheritance({ column: { type: "enum", enum: CouponType, name: "type" } })
export abstract class CouponModel extends GenericModel {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    value!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string;

    @Column({ type: "enum", enum: CouponType })
    type!: CouponType;

    @ManyToOne(() => ClientModel)
    @JoinColumn({ name: "client_id" })
    client!: ClientModel;

    @Column({ type: "varchar", nullable: true, name: "order_id" })
    orderId?: string;

    abstract toEntity(): CouponEntity;
}