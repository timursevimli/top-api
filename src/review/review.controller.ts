import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post('create')
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	@UseGuards(new JwtAuthGuard())
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
		@UserEmail() email: string,
	) {
		console.log(email);
		return this.reviewService.findByProductId(productId);
	}
}
