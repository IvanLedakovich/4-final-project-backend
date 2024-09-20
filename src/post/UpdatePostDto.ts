import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
	@IsNotEmpty()
	@IsInt()
	id: number;

	@IsNotEmpty()
	imageFile: Buffer;

	@IsNotEmpty()
	header: string;

	text: string;

	likesQuantity: number;
}
