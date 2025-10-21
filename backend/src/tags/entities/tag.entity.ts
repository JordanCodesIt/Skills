import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Article } from 'src/articles/entities/article.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Article], { nullable: true })
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
