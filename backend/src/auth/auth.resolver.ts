import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => AuthResponse)
  async signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signup(createUserInput);
  }

  @Mutation(() => String)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const { accessToken } = await this.authService.signin(loginInput);
    return accessToken;
  }
}
