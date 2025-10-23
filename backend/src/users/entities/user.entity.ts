import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm';
import { ArticleComment } from '../../article-comments/entities/article-comment.entity';
import { ArticleReaction } from '../../article-reactions/entities/article-reaction.entity';
import { ArticleView } from '../../article-views/entities/article-view.entity';
import { Article } from '../../articles/entities/article.entity';
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ nullable: true })
  bio: string;

  @Field()
  @Column({ nullable: true })
  profileImage: string;

  @Field()
  @Column({ nullable: true })
  githubUrl: string;

  @Field()
  @Column({ nullable: true })
  website: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => ArticleComment, (articleComment) => articleComment.user)
  comments: ArticleComment[];

  @OneToMany(() => ArticleReaction, (reaction) => reaction.user)
  reactions: ArticleReaction[];

  @OneToMany(() => ArticleView, (view) => view.user)
  articleViews: ArticleView[];
}
