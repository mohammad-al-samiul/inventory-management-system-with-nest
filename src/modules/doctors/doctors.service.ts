import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetDoctorPaymentsDto } from './dto/get-doctor-payment.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly dataSource: DataSource) {}

  async getDoctorPayments(doctor_id: string | null, dto: GetDoctorPaymentsDto) {
    const { start_date, end_date } = dto;

    const dateFilter =
      start_date && end_date
        ? `AND dc.created_at BETWEEN '${start_date}' AND '${end_date}'`
        : '';
    const query = `
      WITH doctor_calls AS (
        SELECT *
      FROM dbo.dt_ondemand_doctor_call dc
      WHERE (${doctor_id ? `'${doctor_id}'` : 'NULL'} IS NULL OR doctor_id = '${doctor_id}')
        ${dateFilter}
      )
      SELECT 
          dc.doctor_id,
          dc.msisdn,
          dc.payment_id,
          dc.payment_type,
          dc.call_type,
          CASE 
              WHEN LOWER(dc.payment_type) = 'ssl' THEN s.total_amount
              WHEN LOWER(dc.payment_type) = 'nagad' THEN n.packageAmount
          END AS amount,
          CASE 
              WHEN LOWER(dc.payment_type) = 'ssl' THEN s.status
              WHEN LOWER(dc.payment_type) = 'nagad' THEN n.status
          END AS status,
          dc.created_at
      FROM doctor_calls dc
      LEFT JOIN dbo.tbl_ssl_req_log s
             ON dc.payment_type = 'SSL' AND dc.payment_id = s.req_tran_id
      LEFT JOIN dbo.tbl_nagad_payment_req_info n
             ON dc.payment_type = 'Nagad' AND dc.payment_id = n.orderId
      WHERE 
          (LOWER(dc.payment_type) = 'ssl' AND s.status = 'VALID')
          OR (LOWER(dc.payment_type) = 'nagad' AND n.status = 'Success')
      ORDER BY dc.created_at;
    `;

    const payments = await this.dataSource.query(query);

    if (!payments.length) {
      return {
        doctor_id,
        total_payments: 0,
        total_revenue: 0,
        ssl: { count: 0, revenue: 0 },
        nagad: { count: 0, revenue: 0 },
        recent_payments: [],
      };
    }

    const total_payments = payments.length;
    const total_revenue = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    );

    // SSL & Nagad summary
    const sslPayments = payments.filter(
      (p) => p.payment_type.toLowerCase() === 'ssl',
    );
    const nagadPayments = payments.filter(
      (p) => p.payment_type.toLowerCase() === 'nagad',
    );

    const ssl = {
      count: sslPayments.length,
      revenue: sslPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    };

    const nagad = {
      count: nagadPayments.length,
      revenue: nagadPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    };

    // 5 most recent payments
    const recent_payments = payments.slice(0, 5).map((p) => ({
      payment_type: p.payment_type,
      msisdn: p.msisdn,
      amount: p.amount,
      date: p.created_at,
      status: p.status,
    }));

    return {
      doctor_id,
      total_payments,
      total_revenue,
      ssl,
      nagad,
      recent_payments,
    };
  }
}
