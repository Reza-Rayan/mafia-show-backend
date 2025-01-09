import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserRole } from 'src/enums/User-Role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from './decorators/role.decorator';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RolesGuard } from './role.guard';
import { SearchQueryDTO } from './dto/search-query.dto';
// --------------------------------------------------------------------------------------

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
  })
  @ApiBody({ type: CreateArticleDto })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/articles',
        filename: (req, file, callback) => {
          const uniqueSuffix = file.originalname + '-' + Date.now();
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? file.path : null;
    return this.articlesService.create(createArticleDto, imagePath);
  }

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'List of all articles.' })
  @Get()
  findAll(@Query() searchQuery: SearchQueryDTO) {
    return this.articlesService.findAll(searchQuery);
  }

  @ApiOperation({ summary: 'Get an article by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the article to retrieve',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'The found article.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an article by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the article to update',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiBody({ type: UpdateArticleDto })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.articlesService.update(id, updateArticleDto, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an article by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the article to delete',
    example: '8bfbff0a-d115-4d44-b97a-ee83ae386db0',
  })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
