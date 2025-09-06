import { CreateDateColumn, Generated, PrimaryGeneratedColumn } from "typeorm";
import Entity from "../domain/DomainEntity";

export default abstract class GenericModel {
	@PrimaryGeneratedColumn("uuid")
	@Generated("uuid")
	_id!: string;

	@CreateDateColumn()
	_createdAt!: Date;

	constructor() {}

	get id(): string {
		return this._id;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	set createdAt(value: Date) {
		this._createdAt = value;
	}

	abstract toEntity(): Entity;
}
