// create-comment.dto.ts
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'لطفا نویسنده کامنت را وارد کنید' })
    author: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'لطفا محتوای کامنت را وارد کنید' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'لطفا شناسه مقاله را وارد کنید' })
    articleId: string;

    @ApiProperty()
    status?: 'Pending' | 'Accept' | 'Denied';
}
