import { IsEmail, IsInt, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsInt()
	@IsNotEmpty()
	id: number

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsNotEmpty()
	nickname: string;

	description: string;

	imageUrl: string;

	myPosts: number[]

	likedPosts: number[]
}
