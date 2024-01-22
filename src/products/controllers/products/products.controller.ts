import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from "../../../users/passport/jwt-auth.guard"
import AuthenticatedRequest from 'src/users/passport/authenticatedUser';
import { ProductsService } from "../../services/products/products.service"
import { ProductDto } from 'src/products/dtos/productDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { handleCatchError } from "../../../helpers/errorhandler"
import * as fs from "fs";
import * as path from 'path';
@Controller()
export class ProductsController {
  constructor(private productsService: ProductsService) { }
  @Get("/products")
  async getIndex(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const products = await this.productsService.getProducts();
    return res.render('index', { title: 'indexPage', isAuthenticated: req.isAuthenticated, products: products,activeProducts:true });
  }

  @UseGuards(JwtAuthGuard)
  @Get("add-product")
  getAddProduct(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    res.render("products/add-product", { title: "ADD PRODUCT", mainCSS: true, productCSS: true, isAuthenticated: req.isAuthenticated,activeAddProduct:true })
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  async getMyProducts(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const userId = (req.user as any)?.id;

      if (!userId) {
        return res.status(401).send('Unauthorized');
      }

      const products = await this.productsService.getMyProducts(userId);

      return res.render('products/my-products', {
        isAuthenticated: true,
        products,
        activeMyProduct:true,
        hasProducts: products.length > 0,
      });
    } catch (error) {
      handleCatchError(error);

    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('edit-product/:productId')
  async getEditProduct(
    @Param('productId') productId: string,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productsService.getEditProduct(Number(productId));
      if (!product) {
        return res.redirect('/products');
      }
      res.render('products/add-product', {
        mainCSS: true,
        productCSS: true,
        isAuthenticated: true,
        combine: true,
        product,
      });
    } catch (error) {
      handleCatchError(error);

    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit-product')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  async postEditProduct(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() productDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    try {
      const editMode = true;
      const hasError = true;
      const combine = editMode || hasError;

      const productId = req.body.productId;
      const filename = image ? image.originalname : '';
      const imagePath = path.resolve(process.cwd(), 'images', filename);
      fs.writeFileSync(imagePath, image.buffer);

      const userId = (req.user as any)?.id;

      const productData:ProductDto = {
        title: productDto.title,
        price: productDto.price,
        description: productDto.description,
        imageUrl:image ? image.originalname : '',
        userId,
      };

      await this.productsService.editProduct(productId, productData, image);

      res.redirect('/my-products');
    } catch (error) {
      handleCatchError(error);

    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete-product/:productId")
  async deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    try {
      await this.productsService.deleteProduct(productId);
      return { message: 'Product deleted successfully!' };
    } catch (error) {
      handleCatchError(error);

    }
  }


  @UseGuards(JwtAuthGuard)
  @Post("add-product")
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  async postAddProduct(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() productDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    try {
      console.log(req.body);

      const baseImageUrl = 'http://localhost:3000';
      console.log("image=====>", image);
      const filename = image ? image.originalname : '';
      const imageUrl: string = image ? filename : '';
      console.log("image url===>", imageUrl);
      const imagePath = path.resolve(process.cwd(), 'images', filename);
      fs.writeFileSync(imagePath, image.buffer);

      const userId = (req.user as any)?.id;

      const productData: ProductDto = {
        title: productDto.title,
        price: productDto.price,
        description: productDto.description,
        imageUrl,
        userId,
      };


      const product = await this.productsService.createProduct(productData);
      res.redirect('/products');
    } catch (error) {
      handleCatchError(error);

    }
  }






}

