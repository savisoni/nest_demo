import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService} from './services/users/users.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';
import { CartService } from 'src/cartmodule/cart/cart.service';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cartitems.entity';
import { CartModule } from 'src/cartmodule/cart.module';
import { SyncCartModule } from 'src/helpers/syncCart.module';

@Module({
  imports: [
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY, 
    signOptions: { expiresIn: '1h' },}),
    ConfigModule.forRoot(),
    CartModule,
    SyncCartModule,
    TypeOrmModule.forFeature([User,CartItem]), 
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
