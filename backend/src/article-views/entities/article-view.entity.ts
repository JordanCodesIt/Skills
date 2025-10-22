import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@ObjectType()
@Entity()
@Unique(['user', 'article'])
export class ArticleView {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.articleViews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, (article) => article.articleViews, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @Field()
  @CreateDateColumn()
  viewedAt: Date;
}
