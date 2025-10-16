import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/subcategories.dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly service: SubcategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSubCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubCategoryDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
