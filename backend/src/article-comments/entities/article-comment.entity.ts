import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ArticleComment {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @ManyToOne(() => ArticleComment, (comment) => comment.replies, {
    nullable: true,
  })
  parentComment?: ArticleComment;

  @OneToMany(() => ArticleComment, (comment) => comment.parentComment)
  replies: ArticleComment[];
}
