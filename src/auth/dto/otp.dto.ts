import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class sendOtpDTO{
    @ApiProperty({
        example: '09121212121',
      })
      @IsString()
      @IsNotEmpty()
      @Length(11)
      phone: string;
}

export class VerifyOtpDTO {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  otp: string;
}
