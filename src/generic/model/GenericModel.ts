import {Column, Generated, PrimaryGeneratedColumn} from "typeorm";

export default abstract class GenericModel {
	@PrimaryGeneratedColumn("uuid")
	@Generated("uuid")
	_id!: string;

	@Column({ type: "date"})
	_createdAt: Date;

	constructor() {
		this._createdAt = new Date();
	}

	get id(): string {
		return this._id;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	set createdAt(value: Date) {
		this._createdAt = value;
	}
}
