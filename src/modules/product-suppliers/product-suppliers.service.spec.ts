import { Test, TestingModule } from '@nestjs/testing';
import { ProductSuppliersService } from './product-suppliers.service';

describe('ProductSuppliersService', () => {
  let service: ProductSuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSuppliersService],
    }).compile();

    service = module.get<ProductSuppliersService>(ProductSuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
