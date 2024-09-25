import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './post/post.entity';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';

describe('AppController', () => {
	let appController: AppController;
	let appService: AppService;
	let userService: UserService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				AppService,
				UserService,
				JwtService,
				{
					provide: getRepositoryToken(Post),
					useValue: {
						find: jest.fn(),
						findOne: jest.fn(),
						save: jest.fn(),
						delete: jest.fn()
					}
				},
				{
					provide: getRepositoryToken(User),
					useValue: {
						save: jest.fn(),
						findOne: jest.fn()
					}
				}
			]
		}).compile();

		appController = module.get<AppController>(AppController);
		appService = module.get<AppService>(AppService);
		userService = module.get<UserService>(UserService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('ApiService - should be defined', () => {
		expect(appService).toBeDefined();
	});

	it('should call createUser', async () => {
		const spy = jest.spyOn(userService, 'createUser').mockImplementation(() =>
			Promise.resolve({
				id: 1,
				email: 'unitTest@gmail.com',
				password: 'unitTest',
				imageUrl: 'unitTest',
				nickname: 'unitTest',
				description: 'unitTest',
				myPosts: [],
				likedPosts: []
			})
		);

		await appController.register({
			email: 'unitTest@gmail.com',
			password: 'unitTest',
			nickname: 'unitTest',
			myPosts: [],
			likedPosts: []
		});

		expect(spy).toHaveBeenCalled();
	});
});
