import { Product } from 'src/modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StockType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('stock_histories')
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.stock_histories)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'enum', enum: StockType })
  stock_type: StockType;

  @Column({ type: 'int' })
  previous_quantity: number;

  @Column({ type: 'int' })
  new_quantity: number;

  @CreateDateColumn()
  created_at: Date;
}
