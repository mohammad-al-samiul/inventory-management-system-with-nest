import { Test, TestingModule } from '@nestjs/testing';
import { ProductSuppliersController } from './product-suppliers.controller';

describe('ProductSuppliersController', () => {
  let controller: ProductSuppliersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSuppliersController],
    }).compile();

    controller = module.get<ProductSuppliersController>(ProductSuppliersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
