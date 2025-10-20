import { Category } from 'src/modules/categories/entities/categories.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sub_categories')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  image_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn({ name: 'category_id' }) // Database column হবে category_id
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];
}
