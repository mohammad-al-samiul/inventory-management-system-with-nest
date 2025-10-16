import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  category_id: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateSubCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
