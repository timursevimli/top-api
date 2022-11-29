import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@Max(5)
	@Min(1, { message: 'Рейтинг не может быть менее 1' })
	@IsNumber()
	rating: number;

	@IsNotEmpty()
	@IsString()
	productId: string;
}
