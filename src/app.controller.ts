import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Req,
	Res,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { CreatePostDto } from './post/CreatePostDto';
import { DeletePostDto } from './post/DeletePostDto';
import { UpdatePostDto } from './post/UpdatePostDto';
import { CreateUserDto } from './user/CreateUserDto';
import { UpdateUserDto } from './user/UpdateUserDto';
import { UserService } from './user/user.service';

@Controller('api')
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly userService: UserService,
		private jwtService: JwtService
	) {}

	@Post('register')
	async register(@Body() dto: CreateUserDto) {
		const hashedPassword = await bcrypt.hash(dto.password, 12);

		const user = await this.userService.createUser({
			email: dto.email,
			password: hashedPassword,
			nickname: dto.nickname,
			myPosts: dto.myPosts,
			likedPosts: dto.likedPosts
		});

		delete user.password;

		return user;
	}

	@Post('update')
	async update(@Body() dto: UpdateUserDto, @Req() request: Request) {
		try {
			const cookie = request.cookies['jwt'];

			const data = await this.jwtService.verifyAsync(cookie);

			const user = await this.userService.findOne({ id: data['id'] });

			if (!user) {
				throw new BadRequestException();
			}

			const hashedPassword = dto.password
				? await bcrypt.hash(dto.password, 12)
				: user.password;

			await bcrypt.hash(dto.password, 12);

			const updatedUser = await this.userService.updateUser({
				id: user.id,
				email: dto.email,
				password: hashedPassword,
				nickname: dto.nickname,
				description: dto.description,
				imageUrl: dto.imageUrl,
				myPosts: user.myPosts,
				likedPosts: user.likedPosts
			});

			// delete updatedUser.password;

			return updatedUser;
		} catch (e) {
			return {
				message: e.message
			};
		}
	}

	@Post('login')
	async login(
		@Body('email') email: string,
		@Body('password') password: string,
		@Res({ passthrough: true }) response: Response
	) {
		const user = await this.userService.findOne({ email: email });

		if (!user) {
			throw new BadRequestException('Invalid credentials');
		}

		if (!(await bcrypt.compare(password, user.password))) {
			throw new BadRequestException('Invalid credentials');
		}

		const jwt = await this.jwtService.signAsync({ id: user.id });

		response.cookie('jwt', jwt, { httpOnly: true });

		user.password = password;

		delete user.password;

		return user;
	}

	@Get('user')
	async user(@Req() request: Request) {
		try {
			const cookie = request.cookies['jwt'];

			const data = await this.jwtService.verifyAsync(cookie);

			if (!data) {
				throw new UnauthorizedException();
			}

			const user = await this.userService.findOne({ id: data['id'] });

			const { password, ...result } = user;

			return result;
		} catch (e) {
			throw new UnauthorizedException();
		}
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt');

		return {
			message: 'success'
		};
	}

	@Get('posts')
	async getPosts(@Req() request: Request) {
		try {
			const posts = await this.appService.getAllPosts();

			return posts;
		} catch (e) {
			throw new BadRequestException();
		}
	}

	@Post('posts/create')
	async createPost(@Body() dto: CreatePostDto, @Req() request: Request) {
		try {
			const cookie = request.cookies['jwt'];

			const data = await this.jwtService.verifyAsync(cookie);

			const user = await this.userService.findOne({ id: data['id'] });

			const post = await this.appService.createPost({
				header: dto.header,
				text: dto.text,
				imageUrl: dto.imageUrl,
				authorId: user.id
			});

			return post;
		} catch (e) {
			throw new UnauthorizedException();
		}
	}

	@Put('posts/update')
	async updatePost(@Body() dto: UpdatePostDto, @Req() request: Request) {
		try {
			const cookie = request.cookies['jwt'];

			const data = await this.jwtService.verifyAsync(cookie);

			const user = await this.userService.findOne({ id: data['id'] });

			const post = await this.appService.getPostById({ id: dto.id });

			if (!post) {
				throw new BadRequestException();
			}

			if (post.authorId != user.id) {
				throw new UnauthorizedException();
			}

			const updatedPost = await this.appService.updatePost({
				id: dto.id,
				header: dto.header,
				text: dto.text,
				imageUrl: dto.imageUrl,
				authorId: user.id
			});

			return updatedPost;
		} catch (e) {
			return {
				message: e.message
			};
		}
	}

	@Put('posts/like')
	async likePost(@Body() postId, value) {
		try {
			let post = await this.appService.getPostById({ id: postId });

			if (!post) {
				throw new BadRequestException();
			}

			post.likesQuantity = Number(
				post.likesQuantity ? post.likesQuantity + value : value
			);

			await this.appService.updatePost(post);

			return post;
		} catch (e) {
			return {
				message: e.message
			};
		}
	}

	@Delete('posts/delete')
	async deletePost(@Req() request: Request, @Body() dto: DeletePostDto) {
		try {
			const cookie = request.cookies['jwt'];

			const data = await this.jwtService.verifyAsync(cookie);

			const user = await this.userService.findOne({ id: data['id'] });

			const post = await this.appService.getPostById({ id: dto.id });

			if (post.authorId != user.id) {
				throw new UnauthorizedException();
			}

			await this.appService.deletePost(post.id);

			return {
				message: 'post is deleted'
			};
		} catch (e) {
			throw new UnauthorizedException();
		}
	}
}
