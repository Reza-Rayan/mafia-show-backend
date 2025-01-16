import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { sendOtpDTO, VerifyOtpDTO } from './dto/otp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiBody({
    description: 'send otp to login',
    type: sendOtpDTO,
  })
  sendOTP(@Body() phone: sendOtpDTO) {
    return this.authService.sendOtp(phone);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({ description: 'Verify OTP to login', type: VerifyOtpDTO })
  verifyOTP(@Body() otpData: VerifyOtpDTO) {
    return this.authService.verifyOtp(otpData);
  }
}
