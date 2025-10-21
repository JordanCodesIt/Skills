import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
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
  username: string;
  @Field()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
  @Field({ nullable: true })
  @IsString()
  bio: string;
  @Field({ nullable: true })
  @IsString()
  profileImage: string;
  @Field({ nullable: true })
  @IsString()
  githubUrl: string;
  @Field({ nullable: true })
  @IsString()
  website: string;
}
