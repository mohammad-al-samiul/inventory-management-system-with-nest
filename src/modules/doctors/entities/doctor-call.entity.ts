import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dt_ondemand_doctor_call', schema: 'dbo' })
export class DoctorCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  msisdn: string;

  @Column({ type: 'varchar', length: 50 })
  doctor_id: string;

  @Column({ type: 'varchar', length: 10 })
  call_type: string;

  @Column({ type: 'varchar', length: 100 })
  payment_id: string;

  @Column({ type: 'varchar', length: 20 })
  payment_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'datetime' })
  created_at: Date;
}
