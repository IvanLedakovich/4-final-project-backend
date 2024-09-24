import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
	@IsNotEmpty()
	@IsInt()
	id: number;

	@IsNotEmpty()
	imageUrl: string;

	@IsNotEmpty()
	header: string;

	text: string;
}
