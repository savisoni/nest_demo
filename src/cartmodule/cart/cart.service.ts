import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cartitems.entity';
import { FileHelper } from 'src/helpers/file.helper';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private readonly fileHelper: FileHelper,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) { }



  async getCart(userId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['cartItems', 'cartItems.product'] });
  }
  async addToCart(userId: number, productId: number): Promise<any> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, deletedAt: null },
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }

    const cartItem = await this.cartItemsRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId }, deletedDate: null
      },

    });
    console.log("Cartitem====>", cartItem);


    if (cartItem) {
      if (cartItem.deletedDate !== null) {
        await this.cartItemsRepository.restore(cartItem.id);
        cartItem.quantity = 1;
        await this.cartItemsRepository.save(cartItem);
      } else {
        cartItem.quantity += 1;
        await this.cartItemsRepository.save(cartItem);
      }
    } else {
      console.log("else");

      const cartitem = this.cartItemsRepository.create({
        cart: { id: cart.id },
        product: { id: productId },
        quantity: 1,
      });

      console.log("cart item===", cartitem);
      await this.cartItemsRepository.save(cartitem);

    }

    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['cartItems'],
    });

    return { message: 'success', cart: updatedCart };
  }

  async deleteCartItem(userId: number, productId: number): Promise<void> {

    console.log("pro id===>", productId);
    console.log("user id===>", userId);

    const cart = await this.cartRepository.findOne({ where: { user: { id: userId } } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    console.log("cart===>", cart);

    const cartItem = await this.cartItemsRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    console.log("cartitem======>", cartItem);


    if (!cartItem) {
      throw new NotFoundException('CartItem not found');
    }

    await this.cartItemsRepository.remove(cartItem);
  }

  async findCartByUserId(userId: number): Promise<Cart | undefined> {
    return this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['cartItems', 'cartItems.product'] });
  }
  async findOrCreateCart(userId: number): Promise<Cart> {
    const existingCart = await this.cartRepository.findOne({
      where: { user: { id: userId }, deletedAt: null },
    });

    if (existingCart) {
      return existingCart;
    }

    const newCart = this.cartRepository.create({ user: { id: userId } });
    return this.cartRepository.save(newCart);
  }

  // async findOne(options: any): Promise<CartItem | undefined> {
  //   return this.cartItemsRepository.findOne(options);
  // }

  // async save(cartItem: CartItem, options?: any): Promise<CartItem> {
  //   return this.cartItemsRepository.save(cartItem, options);
  // }
  
  // async create(data: any, options?: any): Promise<CartItem> {
  //   const cartItem = this.cartItemsRepository.create(data);
  //   return this.cartItemsRepository.save(cartItem, options);
  // }
}
