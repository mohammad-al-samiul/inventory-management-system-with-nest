import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(
      `
       SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        c.id AS category_id,
        c.name AS category_name,
        s.id AS subcategory_id,
        s.name AS subcategory_name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN sub_categories s
        ON p.subcategory_id = s.id
      ORDER BY p.id
      `,
    );
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      `SELECT p.*, s.name as subcategory_name, s up.name as supplier_name
       FROM products p
       JOIN sub_categories s ON p.subcategory_id = s.id
       JOIN suppliers sup ON p.supplier_id = sup.id
       WHERE p.id = $1`,
      [id],
    );
    return res[0];
  }

  async findAllJoined() {
    const rows = await this.dataSource.query(`
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      c.id AS category_id,
      c.name AS category_name,
      s.id AS subcategory_id,
      s.name AS subcategory_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    LEFT JOIN sub_categories s
      ON p.subcategory_id = s.id
    ORDER BY c.id, s.id, p.id
  `);

    const categories: any[] = [];

    for (const row of rows) {
      let category = categories.find((c) => c.id === row.category_id);

      if (!category) {
        category = {
          id: row.category_id,
          name: row.category_name,
          subcategories: [],
          products: [],
        };
        categories.push(category);
      }

      // if subcategory exist
      if (row.subcategory_id) {
        let subcategory = category.subcategories.find(
          (s: any) => s.id === row.subcategory_id,
        );

        if (!subcategory) {
          subcategory = {
            id: row.subcategory_id,
            name: row.subcategory_name,
            products: [],
          };
          category.subcategories.push(subcategory);
        }

        subcategory.products.push({
          id: row.product_id,
          name: row.product_name,
          price: row.price,
        });
      }
      // if subcategory does not exist -> store product in category.products
      else {
        category.products.push({
          id: row.product_id,
          name: row.product_name,
          price: row.price,
        });
      }
    }

    // empty subcategories remove
    return categories.map((cat) => {
      if (cat.subcategories.length === 0) {
        delete cat.subcategories;
      } else if (cat.products.length === 0) {
        delete cat.products;
      }
      return cat;
    });
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
