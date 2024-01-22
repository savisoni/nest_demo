import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHelper } from "../helpers/file.helper";
import { CartItem } from 'src/entities/cartitems.entity';
import { Cart } from 'src/entities/cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart/cart.service';
import { OrderService } from './order/order.service';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Cart,CartItem,Order,OrderItem])],
  controllers: [CartController],
  providers: [CartService,OrderService,FileHelper,StripeService],
  exports: [CartService,OrderService,FileHelper,StripeService]
})
export class CartModule { }
