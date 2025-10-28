import { IsOptional, IsIn, IsDateString } from 'class-validator';

export class GetDoctorPaymentsDto {
  @IsOptional()
  @IsIn(['video', 'audio'])
  callType?: 'video' | 'audio';

  @IsDateString()
  start_date?: string;

  @IsDateString()
  end_date?: string;
}
