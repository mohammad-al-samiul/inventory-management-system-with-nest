import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_nagad_payment_req_info' })
export class NagadPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  orderId: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  packageAmount: number;

  @Column({ type: 'datetime' })
  created_at: Date;
}
