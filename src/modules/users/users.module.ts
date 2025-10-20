import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserOTP } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOTP]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY || 'secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
