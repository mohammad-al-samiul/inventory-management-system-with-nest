import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_ssl_req_log', schema: 'dbo' })
export class SslReqLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  req_tran_id: string;

  @Column({ type: 'varchar', length: 20 })
  status: string; // 'VALID', 'FAILED', etc.

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'datetime' })
  creation_date: Date;
}
