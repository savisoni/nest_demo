import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item';
import { Order } from 'src/entities/order.entity';
import { FileHelper } from 'src/helpers/file.helper';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
       
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private readonly fileHelper: FileHelper,
        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,
      ) { }

      async getOrdersByUserId(userId: number): Promise<Order[]> {
        return this.orderRepository.find({
          where: { user: { id: userId } },
          relations: ['orderItems', 'orderItems.product'],
        });

        
      }

      async createOrder(userId: number): Promise<Order> {
        const order = this.orderRepository.create({ user:{id:userId} });
        return this.orderRepository.save(order);
      }
    
      async createOrderItem(orderId: number, productId: number, quantity: number): Promise<OrderItem> {
        const orderItem = this.orderItemsRepository.create({ order: { id: orderId }, product: { id: productId }, quantity });
        return this.orderItemsRepository.save(orderItem);
      }

}
