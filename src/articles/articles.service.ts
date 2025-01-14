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
    const { search, page = 1, limit = 10 } = searchQuery;

    const queryBuilder = this.articles
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.comments', 'comments');
    if (search) {
      queryBuilder.where('article.title LIKE :search', {
        search: `%${search}%`,
      });
    }
    queryBuilder.skip((page - 1) * limit).take(limit);
    const [articles, total] = await queryBuilder.getManyAndCount();

    if (!articles.length) {
      return {
        message: 'مقاله ای موجود نیست',
      };
    }

    return {
      articles: articles.map((article) => ({
        ...article,
        image: article.image ? `/${article.image}` : null,
        comments: article.comments.map((comment) => comment),
      })),
      totalCount: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  //  End here

  // Find  one article depend on id
  async findOne(id: string) {
    const article = await this.articles.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('مقاله مورد نظر یافت نشد!');
    }

    return article;
  }
  // End here

  // Update aricle service
  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    imagePath?: string, // imagePath could be null if no new image is uploaded
  ) {
    // Find the article by id
    const article = await this.articles.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('مقاله مورد نظر یافت نشد');
    }

    // Conditionally update fields
    if (updateArticleDto.title) {
      article.title = updateArticleDto.title;
    }

    if (updateArticleDto.content) {
      article.content = updateArticleDto.content;
    }

    // If a new image path is provided, update the image
    if (imagePath) {
      article.image = imagePath;
    }

    // Save and return the updated article
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
