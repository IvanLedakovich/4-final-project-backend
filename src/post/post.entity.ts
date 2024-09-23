import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	imageUrl: string;

	@Column()
	header: string;

	@Column({ nullable: true })
	text: string;

	@Column()
	authorId: number;

	@Column({ nullable: true })
	likesQuantity: number;
}
