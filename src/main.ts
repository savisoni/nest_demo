import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as hbs from 'express-handlebars';
import { NestExpressApplication , MulterModule} from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import path, { join } from 'path';
import * as bodyParser from 'body-parser';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import * as dotenv from 'dotenv';

 export const fileStorage = {
    destination: (
      request: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void,
    ): void => {
      const destinationPath = path.join(__dirname, 'images');
      callback(null, destinationPath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ): void => {
      const postImg = file.fieldname + '-' + Date.now();
      callback(null, file.originalname);
    },
  };
  
  export const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

async function bootstrap() {
  dotenv.config(); 
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use(cookieParser());
  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));
  const authMiddleware = new AuthMiddleware();

  // Use AuthMiddleware as middleware
  app.use((req, res, next) => authMiddleware.use(req, res, next));
  app.engine('hbs', hbs.create({
    extname: 'hbs',
    layoutsDir: join(__dirname, '..', 'views/layouts'),
    partialsDir: join(__dirname, '..', 'views/partials'),
    defaultLayout: 'main', 
  }).engine);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'images'));
  app.setViewEngine('hbs');
 



  await app.listen(3000);
  console.log("server start");
  
}
bootstrap();
function exphbs(arg0: { extname: string; }): any {
  throw new Error('Function not implemented.');
}

