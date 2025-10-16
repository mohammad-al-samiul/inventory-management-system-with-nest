import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StockHistoryService } from './stock-history.service';
import {
  CreateStockHistoryDto,
  UpdateStockHistoryDto,
} from './dto/stock-history.dto';

@Controller('stock_histories')
export class StockHistoriesController {
  constructor(private readonly service: StockHistoryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateStockHistoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockHistoryDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
