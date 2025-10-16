import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(
      `SELECT p.*, s.name as subcategory_name, sup.name as supplier_name
       FROM products p
       JOIN sub_categories s ON p.subcategory_id = s.id
       JOIN suppliers sup ON p.supplier_id = sup.id`,
    );
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      `SELECT p.*, s.name as subcategory_name, sup.name as supplier_name
       FROM products p
       JOIN sub_categories s ON p.subcategory_id = s.id
       JOIN suppliers sup ON p.supplier_id = sup.id
       WHERE p.id = $1`,
      [id],
    );
    return res[0];
  }

  async create(dto: CreateProductDto) {
    const {
      name,
      description,
      price,
      color,
      size,
      image_url,
      subcategory_id,
      supplier_id,
    } = dto;
    const res = await this.dataSource.query(
      `INSERT INTO products 
       (name, description, price, color, size, image_url, subcategory_id, supplier_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        name,
        description,
        price,
        color,
        size,
        image_url,
        subcategory_id,
        supplier_id,
      ],
    );
    return res[0];
  }

  async update(id: number, dto: UpdateProductDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    Object.entries(dto).forEach(([key, value]) => {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    });

    values.push(id);

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.dataSource.query(query, values);
    return res[0];
  }

  async delete(id: number) {
    await this.dataSource.query('DELETE FROM products WHERE id = $1', [id]);
    return { message: 'Product deleted successfully' };
  }
}
