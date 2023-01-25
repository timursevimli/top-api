import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { ProductCreateDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND } from './product.constant';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	@UsePipes(new ValidationPipe())
	async createProduct(@Body() dto: ProductCreateDto) {
		return await this.productService.createProduct(dto);
	}

	@Post('find')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async findByReviews(@Body() dto: FindProductDto, @Req() req: Request) {
		return await this.productService.findByReviews(dto);
	}

	@Get(':id')
	async getById(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.getById(id);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}

		return product;
	}

	@Delete(':id')
	async deleteProductById(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.deleteProductById(id);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}

		return product;
	}

	@Patch(':id')
	async updateById(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ProductCreateDto,
	) {
		const product = await this.productService.updateById(id, dto);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}

		return product;
	}
}
