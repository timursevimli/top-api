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
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/top-level-category.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page-constants';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@Post('create')
	@UseGuards(new JwtAuthGuard())
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateTopPageDto) {
		return await this.topPageService.create(dto);
	}

	@HttpCode(200)
	@Post('find')
	@UsePipes(new ValidationPipe())
	async findByCategory(@Body() dto: FindTopPageDto) {
		const findedPages = await this.topPageService.findByCategory(
			dto.firstCategory,
		);

		if (findedPages.length === 0) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return findedPages;
	}

	@Get('textSearch/:text')
	async findByText(@Param('text') text: string) {
		const topPages = await this.topPageService.findByText(text);

		if (topPages.length === 0) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return topPages;
	}

	@Get('byAlias/:alias')
	async findByAlias(@Param('alias') alias: string) {
		const findedPage = await this.topPageService.findByAlias(alias);

		if (!findedPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return findedPage;
	}

	@Get(':id')
	@UseGuards(new JwtAuthGuard())
	async findById(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.findById(id);

		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return topPage;
	}

	@Delete(':id')
	@UseGuards(new JwtAuthGuard())
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedTopPage = await this.topPageService.deleteById(id);

		if (deletedTopPage.deletedCount === 0) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return deletedTopPage;
	}

	@Patch(':id')
	@UseGuards(new JwtAuthGuard())
	@UsePipes(new ValidationPipe())
	async updateById(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateTopPageDto,
	) {
		const updatedProduct = await this.topPageService.updateById(id, dto);

		if (!updatedProduct) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return updatedProduct;
	}
}
