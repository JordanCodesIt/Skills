import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  firstName: string;
  @Field()
  @IsString()
  lastName: string;
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @MinLength(6)
  password: string;
}
