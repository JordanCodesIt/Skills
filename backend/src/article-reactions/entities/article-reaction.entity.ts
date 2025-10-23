import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  CLAP = 'clap',
  FIRE = 'fire',
}
registerEnumType(ReactionType, {
  name: 'ReactionType',
  description: 'Available reaction types for an article',
});

@ObjectType()
@Entity()
@Unique(['user', 'article'])
export class ArticleReaction {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'simple-enum', enum: ReactionType })
  type: ReactionType;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Article)
  @ManyToOne(() => Article, (article) => article.reactions, {
    onDelete: 'CASCADE',
  })
  article: Article;
}
