import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartitems.entity';

@Injectable()
export class SyncCartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async syncCartWithData(cart: Cart, cartData: any[]): Promise<void> {
    const validCartData = Array.isArray(cartData) ? cartData : [];
    
    for (const item of validCartData) {
      const productId = item.productId;
      let quantity = item.quantity;
      if (quantity <= 0) {
        quantity = 1;
      }

      const cartItem = await this.cartItemsRepository.findOne({
        where: { cart: { id: cart.id }, product: { id: productId } },
        withDeleted: true,
      });
      console.log("cartitem======", cartItem);
      

      if (cartItem) {
        cartItem.quantity += quantity;
        await this.cartItemsRepository.save(cartItem);
      } else {
        const newCartItem = this.cartItemsRepository.create({
          cart:{ id: cart.id },
          product: { id: productId },
          quantity: quantity,
        });

        await this.cartItemsRepository.save(newCartItem);
      }
    }
  }


}

