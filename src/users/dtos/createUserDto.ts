import { IsNotEmpty,IsEmail,MinLength,IsString,IsAlphanumeric,Matches} from "class-validator"




export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    username?: string;

    @MinLength(5)
    @IsAlphanumeric()
    password: string;

  }

  