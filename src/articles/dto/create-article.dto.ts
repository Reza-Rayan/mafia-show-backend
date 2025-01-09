import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from "src/comments/dto/create-comment.dto";



export class CreateArticleDto {
    @ApiProperty()
    @IsNotEmpty({message:"لطفا عنوان مقاله را بنویسید"})
    title: string;

    @ApiProperty()
    @IsNotEmpty({message:"لطفا محتوای مقاله را بنویسید"})
    content: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload an image for the article',
        required: false,
    })
    @IsOptional()
    image: Express.Multer.File;

    @ApiProperty({ type: [CreateCommentDto], required: false })
    comments?: CreateCommentDto[];
}
