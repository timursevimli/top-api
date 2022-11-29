import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { response } from 'express';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
	login: 'a@a.ua',
	password: '12345',
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);
		token = body.access_token;
	});

	it('/auth/login (POST) - success', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
				done();
			});
	});

	it('/auth/login (POST) - fail(WrongPassword)', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: 'wrongPass' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.error).toContain('Unauthorized');
				done();
			});
	});

	it('/auth/login (POST) - fail(WrongEmail)', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 'wrong@mail.ua' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.error).toContain('Unauthorized');
				done();
			});
	});

	afterAll(() => {
		disconnect();
	});
});
