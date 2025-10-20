import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    private datasource: DataSource,
    private jwt: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_PASS,
      },
    });
  }

  private async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.NODEMAIL_USER,
      to,
      subject,
      html,
    });
  }

  private generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(dto: CreateUserDto) {
    const { name, email, password, phone, address } = dto;

    const existingUser = await this.datasource.query(
      `SELECT 1 FROM users WHERE email=$1`,
      [email],
    );
    if (existingUser.length)
      throw new BadRequestException('User already exists');

    const hash_password = await bcrypt.hash(password, 10);
    const activation_token = uuidv4();

    const result = await this.datasource.query(
      `INSERT INTO users (name,email,password,phone,address,activation_token)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,email,is_active`,
      [name, email, hash_password, phone, address, activation_token],
    );

    const otp = this.generateOTP();

    await this.sendMail(
      email,
      'Your Account Verification Code',
      `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Account Verification</h2>
        <p>Use this 6-digit OTP to verify your account:</p>
        <h1 style="color:#007bff;">${otp}</h1>
        <p>Expires in 5 minutes.</p>
      </div>`,
    );

    await this.datasource.query(
      `INSERT INTO user_otps (email, otp, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes')`,
      [email, otp],
    );

    return {
      message: 'Registration successful! Check your email for the OTP.',
      user: result[0],
    };
  }

  async login(dto: LoginUserDto) {
    const { email, password } = dto;

    const [user] = await this.datasource.query(
      `SELECT * FROM users WHERE email=$1`,
      [email],
    );

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.is_active)
      throw new UnauthorizedException('Account not activated');

    const token = this.jwt.sign({ id: user.id, email: user.email });

    return { message: 'Login successful', token };
  }

  async sendResetMail(email: string) {
    const [user] = await this.datasource.query(
      `SELECT * FROM users WHERE email=$1`,
      [email],
    );
    if (!user) throw new BadRequestException('User not found');

    const resetToken = uuidv4();
    await this.datasource.query(
      `UPDATE users SET reset_token=$1 WHERE email=$2`,
      [resetToken, email],
    );

    const link = `${process.env.APP_URL}/users/reset/${resetToken}`;
    await this.sendMail(
      email,
      'Reset your password',
      `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    );

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.datasource.query(
      `SELECT * FROM users WHERE reset_token=$1`,
      [dto.token],
    );

    if (!user) throw new BadRequestException('Invalid token');

    const hash = await bcrypt.hash(dto.new_password, 10);
    await this.datasource.query(
      `UPDATE users SET password=$1, reset_token=NULL WHERE reset_token=$2`,
      [hash, dto.token],
    );

    return { message: 'Password updated successfully' };
  }
}

// Code	Meaning
// 200	OK
// 201	Created
// 400	Bad Request (invalid input)
// 401	Unauthorized (no token or invalid token)
// 403	Forbidden (no permission)
// 404	Not Found
// 405	Method Not Allowed
// 500	Internal Server Error
