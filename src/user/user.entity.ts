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

	@Column({nullable: true})
	description: string;

	@Column({nullable: true})
	imageUrl: string;

	@Column("int", { array: true, nullable: true, })
	myPosts: number[];

	@Column("int", { array: true, nullable: true, })
	likedPosts: number[];

}
