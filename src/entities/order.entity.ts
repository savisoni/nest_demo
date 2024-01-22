// order.entity.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, ManyToMany, OneToMany, DeleteDateColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { OrderItem } from "./order-item"
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt:Date;

  @DeleteDateColumn()
  deletedDate:Date;
  
  @UpdateDateColumn()
  updatedAt:Date

}
