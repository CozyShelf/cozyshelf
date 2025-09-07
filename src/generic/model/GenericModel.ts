import {
	Column,
	CreateDateColumn,
	Generated,
	PrimaryGeneratedColumn,
} from "typeorm";
import Entity from "../domain/DomainEntity";

export default abstract class GenericModel {
	@PrimaryGeneratedColumn("uuid")
	@Generated("uuid")
	id!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@Column({ type: "boolean", default: true })
	isActive: boolean = true;

	abstract toEntity(): Entity;
}
