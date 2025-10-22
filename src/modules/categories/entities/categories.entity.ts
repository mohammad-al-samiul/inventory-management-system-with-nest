import { Product } from 'src/modules/products/entities/product.entity';
import { SubCategory } from 'src/modules/subcategories/entities/subcategories.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  slug: string;

  @Column()
  image_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SubCategory, (sub) => sub.category)
  subcategories: SubCategory[];
}
