import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// ---------------------------------------------------------------------------------------------


@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.', type: Comment })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'List of comments', type: [Comment] })
  @ApiResponse({ status: 404, description: 'No comments found' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the comment' })
  @ApiResponse({ status: 200, description: 'The comment found', type: Comment })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }


  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by id' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the comment to update' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated.', type: Comment })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by id' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the comment to delete' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }


  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a comment' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the comment' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: 'The status has been successfully updated', type: Comment })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  updateStatus(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.updateStatus(id, updateCommentDto);
  }

}
