import { Body, Controller, Get, Post, Req, Res, Render, Query, Param, ValidationPipe, UseGuards, HttpStatus, HttpException, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from "../../passport/jwt-auth.guard";
import { Request, Response } from "express"
import { CreateUserDto } from '../../dtos/createUserDto';
import { UsersService } from "../../services/users/users.service";
import { handleCatchError } from "../../../helpers/errorhandler";
import {  SyncCartService  } from "../../../helpers/syncCart.service"
import * as jwt from 'jsonwebtoken';
import { CartService } from 'src/cartmodule/cart/cart.service';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService,
    private   cartService:CartService,
    private readonly syncCartService: SyncCartService,) { }
  @Get("login")
  getLogin(@Res() res: Response) {
    return res.render('login', { layout: 'auth', title: 'loginPage' });
  }
  @Get("signup")
  getSignUp(@Res() res: Response) {
    return res.render('signup', { layout: 'auth', title: 'signupPage' });
  }

  @UseGuards(JwtAuthGuard)
  @Get("abc")
  getDemo(@Req() req) {
    return req.user;
  }

  @Post("login")
  async postLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('cartData') cartData: any[], 
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = await this.usersService.login(email, password);

      if (user) {
        const token = generateJwtToken(user.id); 

        res.cookie('jwt', token, { httpOnly: true });
        const cart =await this.cartService.findOrCreateCart(user.id);

         
        await this.syncCartService.syncCartWithData(cart, cartData);

        res.status(HttpStatus.OK).json({ message: 'Login successful', token });
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {

      handleCatchError(error);
    }
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async postSignUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {

      if (await this.usersService.isEmailExists(createUserDto.email)) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const user = await this.usersService.postSignUp(createUserDto);

      res.json({ message: 'Please check your email for verification' });
    } catch (error) {
      handleCatchError(error);
    }
  }


  @Get('verify-user/:verificationToken')
  async verifyUser(@Param('verificationToken') verificationToken: string) {
    try {
      await this.usersService.verifyUser(verificationToken);
      return `Email verified successfully! Follow this link <h4><a href="http://localhost:3000/users/login"> link </a></h4> to login.`
    } catch (error) {
      handleCatchError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getUserProfile(@Res() res: Response, @Req() req) {
    res.render("user-profile", { title: "User Profile", user: req.user, activeUserProfile: true })
  }


  @Post('logout')
  async postLogout(@Req() req: Request, @Res() res: Response) {
    try {

      const jti = req.cookies['jwt'];

      res.clearCookie('jwt');
      res.redirect('/products');
    } catch (error) {
      handleCatchError(error);
    }
  }

}
function generateJwtToken(userId: number): string {
  const secretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });

  return token;
}

