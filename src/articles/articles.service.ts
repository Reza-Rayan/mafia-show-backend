import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import * as moment from 'moment';
import { SearchQueryDTO } from './dto/search-query.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articles: Repository<Article>,
  ) {}

  // Create an article
  async create(createArticleDto: CreateArticleDto, imagePath: string | null) {
    const existArticle = await this.articles.findOne({
      where: { title: createArticleDto.title },
    });

    if (existArticle) {
      throw new ConflictException('مقاله ای با این عنوان وجود دارد.');
    }
    const article = this.articles.create({
      ...createArticleDto,
      image: imagePath,
    });
    return await this.articles.save(article);
  }
  // End herearticle

  // Find all articles
  async findAll(searchQuery: SearchQueryDTO) {
    const { search } = searchQuery;

    const queryBuilder = this.articles
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.comments', 'comments');

    if (search) {
      queryBuilder.where('article.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    const articles = await queryBuilder.getMany();

    if (!articles.length) {
      return {
        message: 'مقاله ای موجود نیست',
      };
    }

    return articles.map((article) => ({
      ...article,
      created: moment(article.created).format('YYYY/MM/DD HH:mm'),
      image: article.image ? `/${article.image}` : null,
      comments: article.comments.map((comment) => ({
        ...comment,
        created: moment(comment.created).format('YYYY/MM/DD HH:mm'),
      })),
    }));
  }

  //  End here

  // Find  one article depend on id
  async findOne(id: string) {
    const article = await this.articles.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('مقاله مورد نظر یافت نشد!');
    }

    return {
      ...article,
      created: moment(article.created).format('YYYY/MM/DD HH:mm'),
    };
  }
  // End here

  // Update aricle service
  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    image?: Express.Multer.File,
  ) {
    // Find the article by id
    const article = await this.articles.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('مقاله مورد نظر یافت نشد');
    }

    article.title = updateArticleDto.title ?? article.title;
    article.content = updateArticleDto.content ?? article.content;

    if (image) {
      article.image = image.filename;
    }

    return await this.articles.save(article);
  }

  // End here

  // Remove article
  async remove(id: string) {
    const article = await this.findOne(id);
    if (!article) {
      throw new NotFoundException(`مقاله مورد نظر یافت نشد`);
    }

    await this.articles.delete(id);
    return `مقاله مورد نظر حذف شد`;
  }
  // End here
}
