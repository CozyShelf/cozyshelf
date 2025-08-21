import { Generated, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

export default abstract class GenericModel {
	@PrimaryGeneratedColumn("uuid")
	@Generated("uuid")
	_id!: string;

	@CreateDateColumn()
	_createdAt!: Date;

	constructor(){}

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
