import { Product } from 'src/modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.stock)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
