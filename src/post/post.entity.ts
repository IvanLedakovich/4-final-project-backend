import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'bytea',
		nullable: true
	})
	image: Uint8Array;

	@Column()
	header: string;

	@Column({ nullable: true })
	text: string;

	@Column()
	authorId: number;

	@Column({ nullable: true })
	likesQuantity: number;
}
