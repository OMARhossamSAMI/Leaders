import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users: any[] = [];

  constructor(private jwtService: JwtService) {
    this.initializeUsers(); // move async logic here
  }

  private async initializeUsers() {
    const hrPassword = await bcrypt.hash('hr123', 10);
    const itPassword = await bcrypt.hash('it123', 10);
    const AdmissionsPassword = await bcrypt.hash('admissions123', 10);

    this.users = [
      {
        email: 'careers@leadersintcollege.com',
        password: hrPassword,
        role: 'hr',
      }, //hr
      {
        email: 'itsupport@leadersintcollege.com',
        password: itPassword,
        role: 'it',
      }, //it
      {
        email: 'admission@leadersintcollege.com',
        password: AdmissionsPassword,
        role: 'Admission',
      }, //it'
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
