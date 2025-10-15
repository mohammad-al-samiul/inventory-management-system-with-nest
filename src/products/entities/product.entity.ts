import { Entity } from 'typeorm';

@Entity()
export class Product {
  id: number;

  name: string;

  description: string;

  price: number;

  sku: string;
}
