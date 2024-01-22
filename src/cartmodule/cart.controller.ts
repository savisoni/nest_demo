import { Body, Controller, Get, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart/cart.service';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';
import AuthenticatedRequest from 'src/users/passport/authenticatedUser';
import { OrderService } from './order/order.service';
import { handleCatchError } from "../helpers/errorhandler"
import { StripeService } from './stripe/stripe.service';

@Controller()
export class CartController {
  constructor(private cartService: CartService,
    private orderService: OrderService,
    private stripeService: StripeService) { }


  @UseGuards(JwtAuthGuard)
  @Get("cart")
  async getCart(@Req() req: AuthenticatedRequest,
    @Res() res: Response) {

    const userId = req.user.id;

    const cart = await this.cartService.getCart(userId);

    const cartItems = cart ? cart.cartItems : [];
    res.render("products/cart", {
      isAuthenticated: req.isAuthenticated,
      cartItems: cartItems,
      activeCart: true,
      hasProducts: cartItems.length > 0,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("cart")
  async addToCart(@Req() req: AuthenticatedRequest, @Body('productId', ParseIntPipe) productId: number) {
    try {
      const userId = req.user.id;
      return this.cartService.addToCart(userId, productId);
    } catch (error) {
      handleCatchError(error)
    }

  }


  @UseGuards(JwtAuthGuard)
  @Post('cart-delete-item')
  async deleteCartProduct(@Req() req: AuthenticatedRequest, @Res() res: Response, @Body('productId') productId: number) {
    try {
      const userId = req.user.id;

      await this.cartService.deleteCartItem(userId, productId);

      res.redirect('/cart');
    } catch (error) {
      handleCatchError(error);
    }
  }

  @Get("orders")
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const userId = req.user.id;

      const orders = await this.orderService.getOrdersByUserId(userId);

      res.render('products/orders', {
        isAuthenticated: req.isAuthenticated,
        orders,
        activeOrder: true,
        hasLength: orders.length > 0,
      });
    } catch (error) {
      handleCatchError(error);

    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout')
  async getCheckout(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    try {
      const userCart = await this.cartService.findCartByUserId((req.user as any)?.id);

      if (!userCart) {
        res.redirect('/error');
        return;
      }

      const lineItems = userCart.cartItems.map((cartItem) => {
        const product = cartItem.product;

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: cartItem.quantity,
        };
      });

      const session = await this.stripeService.createCheckoutSession(lineItems, req);
      res.redirect(session?.url || '/');
    } catch (error) {
      handleCatchError(error);

    }
  }

  @Get('checkout/success')
  async handleCheckoutSuccess(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      await this.stripeService.handleCheckoutSuccess(userId);
      res.redirect('/orders');
    } catch (error) {
      handleCatchError(error);

    }
  }
  private cartData: any[] = [];

  @Post("local")
  async postLocalCart(@Req() req: Request, @Res() res: Response): Promise<void> {

    try {
      const { cart } = req.body
      this.cartData = cart;
      return;
    } catch (error) {
      handleCatchError(error);
    }

  }
  @Get("local")
  async getLocalCart(@Req() req: Request, @Res() res: Response): Promise<void> {

    res.render("products/localcart", { cartItems: this.cartData });
  }


}
