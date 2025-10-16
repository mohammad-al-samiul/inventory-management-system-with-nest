import { Module } from '@nestjs/common';

import { StockHistoryService } from './stock-history.service';
import { StockHistoriesController } from './stock-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockHistory } from './entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockHistory])],
  controllers: [StockHistoriesController],
  providers: [StockHistoryService],
})
export class StockHistoryModule {}
