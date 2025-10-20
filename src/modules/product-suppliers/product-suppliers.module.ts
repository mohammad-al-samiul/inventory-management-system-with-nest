import { Module } from '@nestjs/common';
import { ProductSuppliersController } from './product-suppliers.controller';
import { ProductSuppliersService } from './product-suppliers.service';

@Module({
  controllers: [ProductSuppliersController],
  providers: [ProductSuppliersService]
})
export class ProductSuppliersModule {}
