
import { Module } from '@nestjs/common';
import { SyncCartService } from './syncCart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cartitems.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem]),
      ],
      providers: [SyncCartService],
      exports: [SyncCartService],
})
export class SyncCartModule {}
