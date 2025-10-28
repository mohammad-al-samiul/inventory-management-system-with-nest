import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserOTP } from './entity/user.entity';
import { JwtGlobalModule } from 'src/common/modules/jwt-global.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOTP]), JwtGlobalModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
