import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ProductsModule } from './modules/products/products.module';
// import { CategoriesModule } from './modules/categories/categories.module';

import { ConfigModule } from '@nestjs/config';
// import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
// import { SuppliersModule } from './modules/suppliers/suppliers.module';
// import { StockHistoryModule } from './modules/stock-history/stock-history.module';
// import { StockModule } from './modules/stock/stock.module';
// import { ProductSuppliersModule } from './modules/product-suppliers/product-suppliers.module';
// import { AuthModule } from './modules/auth/auth.module';
import { DoctorsModule } from './modules/doctors/doctors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // so you don't need to import ConfigModule elsewhere
    }),

    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '1433'),
      username: process.env.DB_USER || 'samiul',
      password: process.env.DB_PASS || 'samiul',
      database: process.env.DB_NAME || 'health_care',
      options: {
        encrypt: false, // disable SSL for local
        trustServerCertificate: true, // allow self-signed cert
      },
      autoLoadEntities: true,
      synchronize: false,
    }),
    // UsersModule,
    // ProductsModule,
    // CategoriesModule,
    // SubcategoriesModule,
    // SuppliersModule,
    // StockModule,
    // StockHistoryModule,
    // ProductSuppliersModule,
    // AuthModule,
    DoctorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/**
 * DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
 */
