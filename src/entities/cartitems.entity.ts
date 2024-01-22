
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn , DeleteDateColumn, CreateDateColumn,UpdateDateColumn} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity()
export class CartItem {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, cart => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Product)
  product: Product;

  @DeleteDateColumn()
  deletedDate:Date;

  @CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date
}
