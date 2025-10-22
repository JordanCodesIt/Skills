import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ArticleComment } from 'src/article-comments/entities/article-comment.entity';
import { ArticleReaction } from 'src/article-reactions/entities/article-reaction.entity';
import { ArticleView } from 'src/article-views/entities/article-view.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Article {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  coverImg: string;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  views: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @Field(() => [Tag], { nullable: true })
  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'article_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ArticleComment, (comment) => comment.article)
  comments: ArticleComment[];

  @OneToMany(() => ArticleReaction, (reaction) => reaction.article)
  reactions: ArticleReaction[];

  @OneToMany(() => ArticleView, (view) => view.article)
  articleViews: ArticleView[];
}
