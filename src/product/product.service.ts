import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from 'src/review/review.model';
import { ProductCreateDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND } from './product.constant';
import { ProductModel } from './product.model';
import { DocumentType } from '@typegoose/typegoose';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel)
		private readonly productModel: ModelType<ProductModel>,
	) {}

	async createProduct(
		dto: ProductCreateDto,
	): Promise<DocumentType<ProductModel>> {
		return this.productModel.create(dto);
	}

	async getById(id: string): Promise<DocumentType<ProductModel> | null> {
		return this.productModel.findById(id).exec();
	}

	async deleteProductById(
		id: string,
	): Promise<DocumentType<ProductModel> | null> {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(
		id: string,
		dto: ProductCreateDto,
	): Promise<DocumentType<ProductModel> | null> {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findByReviews(dto: FindProductDto) {
		return this.productModel
			.aggregate([
				{
					$match: {
						categories: dto.category,
					},
				},
				{
					$sort: { createdAt: -1 },
				},
				{
					$limit: dto.limit,
				},
				{
					$lookup: {
						from: 'Review',
						pipeline: [
							{
								$sort: { createdAt: -1 },
							},
						],
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$sort: {
						'reviews.createdAt': 1,
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$reviews' },
						reviewAvg: { $avg: '$reviews.rating' },
					},
				},
			])
			.exec() as ProductModel &
			{
				reviews: ReviewModel[];
				reviewCount: number;
				reviewAvg: number;
			}[];
	}
}
