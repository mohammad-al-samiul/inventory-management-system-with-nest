import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/suppliers.dto';

@Injectable()
export class SuppliersService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query('SELECT * FROM suppliers ORDER BY id ASC');
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      'SELECT * FROM suppliers WHERE id = $1',
      [id],
    );
    return res[0];
  }

  async create(dto: CreateSupplierDto) {
    const { name, email, phone, address } = dto;
    const res = await this.dataSource.query(
      `INSERT INTO suppliers (name,email,phone,address)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, phone, address],
    );
    return res[0];
  }

  async update(id: number, dto: UpdateSupplierDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    Object.entries(dto).forEach(([key, value]) => {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    });

    values.push(id);
    const query = `UPDATE suppliers SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.dataSource.query(query, values);
    return res[0];
  }

  async delete(id: number) {
    await this.dataSource.query('DELETE FROM suppliers WHERE id = $1', [id]);
    return { message: 'Supplier deleted successfully' };
  }
}
