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

/*
// doctors.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetDoctorPaymentsDto } from './dto/get-doctor-payments.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly dataSource: DataSource) {}

  async getDoctorPayments(doctorId: string, dto: GetDoctorPaymentsDto) {
    const whereClauses: string[] = ['dc.doctor_id = ?'];
    const params: any[] = [doctorId];

    if (dto.callType) {
      whereClauses.push('dc.call_type = ?');
      params.push(dto.callType);
    }
    if (dto.fromDate) {
      whereClauses.push('dc.created_at >= ?');
      params.push(dto.fromDate);
    }
    if (dto.toDate) {
      whereClauses.push('dc.created_at <= ?');
      params.push(dto.toDate);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // ---------- Query 1: SSL ----------
    const sslQuery = `
      SELECT 
        dc.doctor_id,
        'SSL' AS payment_type,
        dc.payment_id,
        dc.msisdn,
        s.total_amount AS amount,
        s.status,
        s.creation_date AS payment_date
      FROM health_care.dbo.dt_ondemand_doctor_call dc
      LEFT JOIN payment_gateway_service.dbo.tbl_ssl_req_log s
        ON dc.payment_id = s.req_tran_id
      ${whereSql}
        AND LOWER(dc.payment_type) = 'ssl'
        AND s.status = 'VALID';
    `;

    const sslData = await this.dataSource.query(sslQuery, params);

    // ---------- Query 2: NAGAD ----------
    const nagadQuery = `
      SELECT 
        dc.doctor_id,
        'Nagad' AS payment_type,
        dc.payment_id,
        dc.msisdn,
        n.packageAmount AS amount,
        n.status,
        n.created_at AS payment_date
      FROM health_care.dbo.dt_ondemand_doctor_call dc
      LEFT JOIN payment_gateway_service.dbo.tbl_nagad_payment_req_info n
        ON dc.payment_id = n.orderId
      ${whereSql}
        AND LOWER(dc.payment_type) = 'nagad'
        AND n.status = 'Success';
    `;

    const nagadData = await this.dataSource.query(nagadQuery, params);

    // ---------- Merge results ----------
    const allPayments = [...sslData, ...nagadData];

    // ---------- Aggregation ----------
    const sslCount = sslData.length;
    const sslRevenue = sslData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const nagadCount = nagadData.length;
    const nagadRevenue = nagadData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalCount = sslCount + nagadCount;
    const totalRevenue = sslRevenue + nagadRevenue;

    // ---------- Recent 5 ----------
    const recentPayments = allPayments
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
      .slice(0, 5)
      .map((p) => ({
        paymentType: p.payment_type,
        msisdn: p.msisdn,
        amount: Number(p.amount || 0),
        date: p.payment_date ? new Date(p.payment_date).toISOString() : null,
        status: p.status,
      }));

    // ---------- Final Response ----------
    return {
      doctorId,
      totalSuccessfulPayments: totalCount,
      totalRevenue,
      breakdown: {
        ssl: { count: sslCount, revenue: sslRevenue },
        nagad: { count: nagadCount, revenue: nagadRevenue },
      },
      recentPayments,
    };
  }
}


/*

MSSQL engine এইভাবে বুঝে:

@0 = params[0]

@1 = params[1]

@2 = params[2]

@3 = params[3]

GET /doctors/123/payments


GET /doctors/123/payments?callType=video&fromDate=2025-01-01&toDate=2025-01-31

*/
