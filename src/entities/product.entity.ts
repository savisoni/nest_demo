import { Entity, Column, PrimaryGeneratedColumn , DeleteDateColumn, ManyToOne,CreateDateColumn, UpdateDateColumn} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

 
  @Column()
  title: string;

  @Column()
  price:number;


  @Column()
  imageUrl: string;

  @Column()
  description: string;

  @DeleteDateColumn()
  deletedDate: Date

  @CreateDateColumn()
  createdAt:Date;

  @ManyToOne(type => User)
  user: User;

  @UpdateDateColumn()
  updatedAt:Date

}