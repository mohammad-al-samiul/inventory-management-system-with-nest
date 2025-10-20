import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';

import { ConfigModule } from '@nestjs/config';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { StockHistoryModule } from './modules/stock-history/stock-history.module';
import { StockModule } from './modules/stock/stock.module';
import { ProductSuppliersModule } from './modules/product-suppliers/product-suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // so you don't need to import ConfigModule elsewhere
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      //url: process.env.DB_URL,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,
      synchronize: true, // only for dev
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SubcategoriesModule,
    SuppliersModule,
    StockModule,
    StockHistoryModule,
    ProductSuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
