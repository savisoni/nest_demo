import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../services/users/users.service'; // Assuming UserService handles user lookup

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies?.jwt;
          return token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET_KEY, 
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.id); 
    if (user) {
      return user;
    } else {
      return false;
    }
  }
}
