import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	imageUrl: string;

	@IsNotEmpty()
	header: string;

	text: string;
}
