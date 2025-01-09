// comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from 'src/articles/entities/article.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import * as moment from 'moment';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Article) private articles: Repository<Article>
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    // Find the article by ID
    const article = await this.articles.findOne({
      where: { id: createCommentDto.articleId },
    });

    if (!article) {
      throw new NotFoundException('مقاله یافت نشد');
    }

    // Create the new comment
    const newComment = this.commentsRepository.create({
      author: createCommentDto.author,
      description: createCommentDto.description,
      article,
      status:"Pending"
    });

    // Save the new comment to the database
    return this.commentsRepository.save(newComment);
  }

  async findAll() {
    const comments = await this.commentsRepository.find({ relations: ['article'] });
    if(comments.length==0){
      return {
        message:"کامنتی وجود ندارد."
      }
    }

    return comments.map(comment => ({
      ...comment,
      created: moment(comment.created).format('YYYY/MM/DD HH:mm'),
    }));
  }

  async findOne(id: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['article'],
    });

    if (!comment) {
      throw new NotFoundException('کامنت یافت نشد');
    }

    return {
      ...comment,
      created: moment(comment.created).format('YYYY/MM/DD HH:mm'),
    };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('کامنت یافت نشد');
    }

    // Update the comment properties
    return this.commentsRepository.save({ ...comment, ...updateCommentDto });
  }

  async remove(id: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('کامنت یافت نشد');
    }

    await this.commentsRepository.remove(comment);
    return { message: 'حذف کامنت موفقیت آمیز بود' };
  }



  // Update status of comment
  async updateStatus(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('کامنت یافت نشد');
    }

    comment.status = updateCommentDto.status;

    return this.commentsRepository.save(comment);
  }
}
