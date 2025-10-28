import { Controller, Get, Param, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { GetDoctorPaymentsDto } from './dto/get-doctor-payment.dto';

@Controller('api/v1/doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get(':doctorId/payments')
  async getPayments(
    @Param('doctorId') doctorId: string,
    @Query() query: GetDoctorPaymentsDto,
  ) {
    return this.doctorsService.getDoctorPayments(doctorId, query);
  }
}
