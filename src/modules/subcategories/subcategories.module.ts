import { Module } from '@nestjs/common';
import { SubcategoriesController } from './subcategories.controller';
import { SubcategoriesService } from './subcategories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/subcategories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory])],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule {}
