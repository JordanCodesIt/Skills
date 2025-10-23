import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TagsModule } from './tags/tags.module';
import { ArticleCommentsModule } from './article-comments/article-comments.module';
import { ArticleReactionsModule } from './article-reactions/article-reactions.module';
import { ArticleViewsModule } from './article-views/article-views.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProd = process.env.NODE_ENV === 'production';

        return isProd
          ? {
              type: 'postgres',
              host: process.env.DATABASE_HOST,
              port: parseInt(process.env.DATABASE_PORT || '5433', 10),
              username: process.env.DATABASE_USER,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE_NAME,
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: false, //
              ssl: false,
            }
          : {
              type: 'sqlite',
              database: 'skillhub.db',
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
            };
      },
    }),
    UsersModule,
    ArticlesModule,
    AuthModule,
    TagsModule,
    ArticleCommentsModule,
    ArticleReactionsModule,
    ArticleViewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
