import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query('SELECT * FROM categories ORDER BY id ASC');
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      'SELECT * FROM categories WHERE id = $1',
      [id],
    );
    return res[0];
  }

  async create(dto: CreateCategoryDto) {
    const { name, slug, image_url, description } = dto;
    const res = await this.dataSource.query(
      `INSERT INTO categories (name, slug, image_url, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, slug, image_url, description],
    );
    return res[0];
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    Object.entries(dto).forEach(([key, value]) => {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    });

    values.push(id);

    const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.dataSource.query(query, values);
    return res[0];
  }

  async delete(id: number) {
    await this.dataSource.query('DELETE FROM categories WHERE id = $1', [id]);
    return { message: 'Category deleted successfully' };
  }
}
