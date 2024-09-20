import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	imageFile: Buffer;

	@IsNotEmpty()
	header: string;

	text: string;
}
