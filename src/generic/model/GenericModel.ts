import { CreateDateColumn, Generated, PrimaryGeneratedColumn } from "typeorm";
import Entity from "../domain/DomainEntity";

export default abstract class GenericModel {
	@PrimaryGeneratedColumn("uuid")
	@Generated("uuid")
	id!: string;

	@CreateDateColumn()
	createdAt!: Date;

	abstract toEntity(): Entity;
}
