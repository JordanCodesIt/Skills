import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(createUserInput: CreateUserInput) {
    const existingUser = await this.usersService.findByEmail(
      createUserInput.email,
    );
    if (existingUser) {
      throw new ConflictException('Email Is Existing');
    }
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const user = await this.usersService.create({
      ...createUserInput,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { user, accessToken };
  }

  async signin(loginInput: LoginInput): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginInput.email);
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credenrials');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
