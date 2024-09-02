import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	nickname: string;

	@Column("int", { array: true })
	myPosts: number[];

	@Column("int", { array: true })
	likedPosts: number[];
}
