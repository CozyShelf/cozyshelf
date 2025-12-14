import {
	Column,
	CreateDateColumn,
	Generated,
	PrimaryGeneratedColumn,
} from "typeorm";

export default abstract class GenericModel {
	@PrimaryGeneratedColumn("uuid")
	@Generated("uuid")
	id!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@Column({ type: "boolean" })
	isActive: boolean = true;
}
