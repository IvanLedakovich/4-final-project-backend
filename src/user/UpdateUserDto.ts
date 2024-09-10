import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
	@IsInt()
	@IsNotEmpty()
	id: number;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	password: string;

	@IsNotEmpty()
	nickname: string;

	description: string;

	imageUrl: string;

	myPosts: number[];

	likedPosts: number[];
}
