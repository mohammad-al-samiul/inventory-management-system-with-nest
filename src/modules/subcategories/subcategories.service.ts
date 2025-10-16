import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/subcategories.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(
      `SELECT s.*, c.name as category_name
       FROM sub_categories s
       JOIN categories c ON s.category_id = c.id`,
    );
  }

  async findOne(id: number) {
    const res = await this.dataSource.query(
      `SELECT s.*, c.name as category_name
       FROM sub_categories s
       JOIN categories c ON s.category_id = c.id
       WHERE s.id = $1`,
      [id],
    );
    return res[0];
  }

  async create(dto: CreateSubCategoryDto) {
    const { name, slug, image_url, description, category_id } = dto;
    const res = await this.dataSource.query(
      `INSERT INTO sub_categories
       (name, slug, image_url, description, category_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, slug, image_url, description, category_id],
    );
    return res[0];
  }

  async update(id: number, dto: UpdateSubCategoryDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    Object.entries(dto).forEach(([key, value]) => {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    });

    values.push(id);

    const query = `UPDATE sub_categories SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.dataSource.query(query, values);
    return res[0];
  }

  async delete(id: number) {
    await this.dataSource.query('DELETE FROM sub_categories WHERE id = $1', [
      id,
    ]);
    return { message: 'SubCategory deleted successfully' };
  }
}
