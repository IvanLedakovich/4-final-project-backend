import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true, type: 'bytea' })
	imageFile: Buffer;

	@Column()
	header: string;

	@Column({ nullable: true })
	text: string;

	@Column()
	authorId: number;

	@Column({ nullable: true })
	likesQuantity: number;
}
