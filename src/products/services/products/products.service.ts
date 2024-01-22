import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../../entities/product.entity';
import { ProductDto } from 'src/products/dtos/productDto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { FileHelper } from '../../../helpers/file.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly fileHelper: FileHelper,
 
  ) { }

  async createProduct(productDto: ProductDto): Promise<Product> {

    const product = this.productRepository.create(productDto);
    product.user = { id: productDto.userId } as User;

    const productdata = await this.productRepository.save(product);

    return productdata;
  }

  async getProducts() {
    const products = await this.productRepository.find();
    return products;
  }

  async getEditProduct(productId: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id: productId } });
  }
  async getMyProducts(userId: number): Promise<Product[]> {
    return this.productRepository.find({ where: { user: { id: userId } } });
  }
  async editProduct(productId: number, productData: Partial<Product>, image: Express.Multer.File): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new Error('Product not found');
    }

    product.title = productData.title;
    product.description = productData.description;
    product.price = productData.price;

    if (image) {
      product.imageUrl = image.path;
    }

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async deleteProduct(productId: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const imagePath = product.imageUrl;

    await this.fileHelper.deleteFile(imagePath);

    await this.productRepository.delete(productId);
  }

  




}
