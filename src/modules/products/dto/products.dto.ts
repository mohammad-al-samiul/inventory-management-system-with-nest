import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDecimal()
  price: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsInt()
  subcategory_id: number;

  @IsInt()
  supplier_id: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsInt()
  subcategory_id?: number;

  @IsOptional()
  @IsInt()
  supplier_id?: number;
}
