import { IsEnum, IsNumber } from 'class-validator';

export class CreateStockHistoryDto {
  @IsNumber()
  product_id: number;

  @IsEnum(['IN', 'OUT'])
  stock_type: 'IN' | 'OUT';

  @IsNumber()
  previous_quantity: number;

  @IsNumber()
  new_quantity: number;
}

export class UpdateStockHistoryDto {
  @IsNumber()
  product_id?: number;

  @IsEnum(['IN', 'OUT'])
  stock_type?: 'IN' | 'OUT';

  @IsNumber()
  previous_quantity?: number;

  @IsNumber()
  new_quantity?: number;
}
