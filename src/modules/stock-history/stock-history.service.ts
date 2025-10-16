import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateStockHistoryDto,
  UpdateStockHistoryDto,
} from './dto/stock-history.dto';

@Injectable()
export class StockHistoryService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(
      `SELECT sh.*, p.name as product_name
       FROM stock_histories sh
       JOIN products p ON sh.product_id = p.id
       ORDER BY sh.id ASC`,
    );
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      `SELECT sh.*, p.name as product_name
       FROM stock_histories sh
       JOIN products p ON sh.product_id = p.id
       WHERE sh.id = $1`,
      [id],
    );
    return res[0];
  }

  async create(dto: CreateStockHistoryDto) {
    const { product_id, stock_type, previous_quantity, new_quantity } = dto;
    const res = await this.dataSource.query(
      `INSERT INTO stock_histories 
       (product_id, stock_type, previous_quantity, new_quantity)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [product_id, stock_type, previous_quantity, new_quantity],
    );
    return res[0];
  }

  async update(id: number, dto: UpdateStockHistoryDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    Object.entries(dto).forEach(([key, value]) => {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    });
    values.push(id);

    const query = `UPDATE stock_histories SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.dataSource.query(query, values);
    return res[0];
  }

  async delete(id: number) {
    await this.dataSource.query('DELETE FROM stock_histories WHERE id = $1', [
      id,
    ]);
    return { message: 'StockHistory deleted successfully' };
  }
}
