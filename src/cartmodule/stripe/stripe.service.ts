import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cartitems.entity';
import { Product } from 'src/entities/product.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../order/order.service';
import { Order } from 'src/entities/order.entity';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;
    constructor(
    private orderService: OrderService,

        private  cartService: CartService,
        @InjectRepository(Cart)
        private  cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepositoy:Repository<CartItem>

       
      ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
          });
      }

     
    
      async createCheckoutSession(lineItems: any[], req: any): Promise<any> {
        try {
          const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: req.protocol + '://' + req.get('host') + `/checkout/success`,
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
          });
    
          return session;
        } catch (error) {
          throw new BadRequestException('Error creating checkout session');
        }
      }

      async handleCheckoutSuccess(userId: number): Promise<void> {
        try {
          const cart = await this.cartService.findCartByUserId(userId);
      console.log("cart===>", cart);
      
          if (!cart) {
            return;
          }
      
          const order = await this.orderService.createOrder(1);
          console.log("order====>", order);
          
      
          for (const cartItem of cart.cartItems) {
            await this.orderService.createOrderItem(order.id, cartItem.product.id, cartItem.quantity);
            await this.cartItemRepositoy.remove(cartItem);
          }
      
          cart.cartItems = [];
      
          await this.cartRepository.save(cart);
      
        } catch (error) {
          return error;
        }
      }
      
     
      
}
