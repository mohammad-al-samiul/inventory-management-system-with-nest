import { IsInt, IsOptional } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  product_id: number;

  @IsInt()
  quantity: number;
}

export class UpdateStockDto {
  @IsOptional()
  @IsInt()
  product_id?: number;

  @IsOptional()
  @IsInt()
  quantity?: number;
}
