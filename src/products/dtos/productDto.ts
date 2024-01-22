import { IsNotEmpty,MinLength,IsString} from "class-validator"



export class ProductDto {

    @IsNotEmpty()
    @MinLength(4)
    title: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @MinLength(8)
    description: string;

    imageUrl: string;

    userId: number;
  }
  