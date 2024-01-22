import { Entity, Column, PrimaryGeneratedColumn,DeleteDateColumn,OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;


  @Column()
  email: string;

  @Column()
  password:string;


  @Column({nullable:true})
  verificationToken: string | null;

  @Column({default:false})
  isValid: boolean;

  @Column({default:null})
  resetToken: string | null;

  @Column({default:null})
  resetTokenExpiration: Date | null;

  @DeleteDateColumn()
  deletedDate: Date;

  @CreateDateColumn()
  createdAt:Date;

  @OneToMany(type => Product, product => product.user)
  products: Product[];

  @UpdateDateColumn()
  updatedAt:Date

  

   
}