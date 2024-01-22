import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity"
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/services/users/users.service';
import { ProductsController } from './products/controllers/products/products.controller';
import { ProductsService } from './products/services/products/products.service';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from "./entities/order-item";
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartitems.entity';
import { PassportModule } from "@nestjs/passport"
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CartModule } from './cartmodule/cart.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: '../images',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    PassportModule,
  TypeOrmModule.forRoot({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User,Product,Order,OrderItem,Cart,CartItem],
    synchronize: true
  }),
    UsersModule,
    ProductsModule,
    CartModule
 
    
  ],
  controllers: [],
  providers: [AuthMiddleware],
})
export class AppModule { }
