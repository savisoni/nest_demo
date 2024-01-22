import {Entity,Column,DeleteDateColumn,CreateDateColumn,UpdateDateColumn,PrimaryGeneratedColumn,OneToOne,JoinColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cartitems.entity";


@Entity()
export class Cart{
     @PrimaryGeneratedColumn()
     id:number;

     @CreateDateColumn()
     createdAt:Date;

     @UpdateDateColumn()
     updatedAt:Date;

     @DeleteDateColumn()
     deletedAt:Date;

     @OneToOne(()=> User)
     @JoinColumn()
     user:User

     @OneToMany(() => CartItem, cartItem => cartItem.cart)
      cartItems: CartItem[];
}