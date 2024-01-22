import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products/products.controller';
import { ProductsService } from './services/products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { FileHelper } from "../helpers/file.helper";
import { CartItem } from 'src/entities/cartitems.entity';
import { Cart } from 'src/entities/cart.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService,FileHelper],
  exports: [ProductsService,FileHelper]
})
export class ProductsModule { }
