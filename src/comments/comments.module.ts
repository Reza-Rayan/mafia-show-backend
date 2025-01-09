import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comment,Article])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
