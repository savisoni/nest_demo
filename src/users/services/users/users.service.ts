import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { CreateUserDto } from 'src/users/dtos/createUserDto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async postSignUp(createUserDto: CreateUserDto): Promise<void> {
    const verificationToken = crypto.randomBytes(16).toString('hex');
    const jwtToken = this.jwtService.sign({ email: createUserDto.email, verificationToken }, {
      expiresIn: '1h',
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const user = this.userRepository.create({
      ...createUserDto, // Spread DTO properties
      verificationToken,
    });

    try {
      await this.userRepository.save(user);
      const result = await sgMail.send({
        to: createUserDto.email,
        from: 'sonisavi3901@gmail.com',
        subject: 'Email Verification',
        html: `<h5>click this <a href="http://localhost:3000/users/verify-user/${jwtToken}">link</a> to verify your email address</h5>`,
      });
      console.log('SendGrid API Response:', result);
    } catch (error) {
      console.error('Error sending email:', error);
      // Handle error here (e.g., rollback user creation, send notification)
    }
  }

  async verifyUser(verificationToken: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(verificationToken, { secret: process.env.JWT_SECRET_KEY});
      const { email, verificationToken: token } = decoded;
      console.log("decoded======>", token);

      const user = await this.userRepository.findOne({ where: { email, verificationToken: token } });

      console.log("user----->", user);

      if (!user) {
        throw new NotFoundException('User not found or invalid token');
      }

      user.isValid = true;
      user.verificationToken = null;

      await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('Error verifying user:', error);
        throw new BadRequestException('Invalid token');
      }
    }
  }
  async login(email: string, password: string): Promise<any> {


    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('No user found with this email');
    }

    if (!user.isValid) {
      throw new Error('User not verified');
    }


    if (password !== user.password) {
      throw new Error('Password incorrect');
    }

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });


    return { message: 'success', token, user };
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }
  async isEmailExists(email: string): Promise<boolean> {
    // Query your database to check if a user with the given email exists
    const existingUser = await this.userRepository.findOneBy({ email });
    return !!existingUser; // Convert to boolean
  }

  

}


// private async hashPassword(password: string): Promise<string> {
//   const saltRounds = 10; // Adjust as needed
//   return await bcrypt.hash(password, saltRounds);
// }

