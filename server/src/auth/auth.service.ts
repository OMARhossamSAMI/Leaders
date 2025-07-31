import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
config(); // Load environment variables
@Injectable()
export class AuthService {
  private users: any[] = [];

  constructor(private jwtService: JwtService) {
    this.initializeUsers(); // move async logic here
  }

  private async initializeUsers() {
    const hrPassword = await bcrypt.hash(process.env.HR_PASSWORD!, 10);
    const itPassword = await bcrypt.hash(process.env.IT_PASSWORD!, 10);
    const admissionPassword = await bcrypt.hash(
      process.env.ADMISSION_PASSWORD!,
      10,
    );

    this.users = [
      {
        email: process.env.HR_EMAIL,
        password: hrPassword,
        role: 'hr',
      },
      {
        email: process.env.IT_EMAIL,
        password: itPassword,
        role: 'it',
      },
      {
        email: process.env.ADMISSION_EMAIL,
        password: admissionPassword,
        role: 'Admission',
      },
    ];
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    return { email: user.email, role: user.role };
  }

  async login(user: any) {
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
