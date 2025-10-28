import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorCall } from './entities/doctor-call.entity';
import { SslReqLog } from './entities/ssl-payment.entity';
import { NagadPayment } from './entities/nagad-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorCall, SslReqLog, NagadPayment])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
