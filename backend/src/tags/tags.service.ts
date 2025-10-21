import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagInput } from './dto/create-tag.input';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) {}
  async create(createTagInput: CreateTagInput): Promise<Tag> {
    const existingTag = await this.tagRepo.findOne({
      where: { name: createTagInput.name.toLowerCase() },
    });
    if (existingTag) {
      throw new ConflictException('tag already exists');
    }
    const tag = this.tagRepo.create({
      name: createTagInput.name.toLowerCase(),
    });
    return this.tagRepo.save(tag);
  }

  findAll(): Promise<Tag[]> {
    return this.tagRepo.find({ relations: ['articles'] });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepo.findOne({
      where: { id },
      relations: ['articles'],
    });
    if (!tag) throw new NotFoundException(`Tag #${id} not found`);
    return tag;
  }

  async remove(id: number): Promise<boolean> {
    const tag = await this.findOne(id);
    await this.tagRepo.remove(tag);
    return true;
  }
}
