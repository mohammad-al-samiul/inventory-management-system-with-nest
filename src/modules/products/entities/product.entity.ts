import { SubCategory } from 'src/modules/subcategories/entities/subcategories.entity';
import { StockHistory } from 'src/modules/stock-history/entities/stock.entity';
import { Stock } from 'src/modules/stock/entities/stock.entities';
import { Supplier } from 'src/modules/suppliers/entities/suppliers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/modules/categories/entities/categories.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => Category, (c) => c.subcategories)
  category_id: number;

  @ManyToOne(() => SubCategory, (sub) => sub.products)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubCategory;

  @ManyToOne(() => Supplier, (sup) => sup.products)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToOne(() => Stock, (stock) => stock.product)
  stock: Stock;

  @OneToMany(() => StockHistory, (history) => history.product)
  stock_histories: StockHistory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
