import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateStockDto, UpdateStockDto } from './dto/stock.dto';

@Injectable()
export class StockService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(
      `SELECT st.*, p.name as product_name
       FROM stocks st
       JOIN products p ON st.product_id = p.id
       ORDER BY st.id ASC`,
    );
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      `SELECT st.*, p.name as product_name
       FROM stocks st
       JOIN products p ON st.product_id = p.id
       WHERE st.id = $1`,
      [id],
    );
    return res[0];
  }

  async create(dto: CreateStockDto) {
    const { product_id, quantity } = dto;

    // যদি একই product এর stock থাকে, quantity update হবে
    const existing = await this.dataSource.query(
      `SELECT * FROM stocks WHERE product_id = $1`,
      [product_id],
    );

    if (existing.length) {
      const newQuantity = existing[0].quantity + quantity;
      const updated = await this.dataSource.query(
        `UPDATE stocks SET quantity = $1 WHERE id = $2 RETURNING *`,
        [newQuantity, existing[0].id],
      );
      return updated[0];
    } else {
      const res = await this.dataSource.query(
        `INSERT INTO stocks (product_id, quantity) VALUES ($1,$2) RETURNING *`,
        [product_id, quantity],
      );
      return res[0];
    }
  }

  async update(id: number, dto: UpdateStockDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    Object.entries(dto).forEach(([key, value]) => {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    });

    values.push(id);
    const query = `UPDATE stocks SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.dataSource.query(query, values);
    return res[0];
  }

  async delete(id: number) {
    await this.dataSource.query('DELETE FROM stocks WHERE id = $1', [id]);
    return { message: 'Stock deleted successfully' };
  }
}
