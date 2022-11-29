import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	@IsEmail()
	login: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
