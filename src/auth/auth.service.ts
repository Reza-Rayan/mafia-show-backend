import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { sendOtpDTO, VerifyOtpDTO } from './dto/otp.dto';
import * as speakeasy from 'speakeasy';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
// --------------------------------------------------------------------------------

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository:Repository<User>){}

    async sendOtp(phoneData: sendOtpDTO) {
        let user = await this.userRepository.findOne({ where: { phone: phoneData.phone } });

        if (!user) {
            // Register new user if not exists
            user = this.userRepository.create({
                phone: phoneData.phone,
                otp: '',
                otpExpiration: null,
                // other user properties can be set here
            });
            await this.userRepository.save(user);
        }
        // Generate a 5-digit numeric OTP
        const otp = speakeasy.totp({
            secret: user.id.toString(),
            encoding: 'base32',
            digits: 5
        });
        // Set OTP expiration to 2 minutes from now
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 2);
        const formattedExpiration = moment(otpExpiration).fromNow();
        // Save OTP and expiration to the user record
        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await this.userRepository.save(user);
        return {
            message: "ذمر عبور موقت ارسال شد",
            code: otp,
            expired_time: formattedExpiration
         };
    }

    async verifyOtp(verifyData: VerifyOtpDTO){
        const user = await this.userRepository.findOne({ where: { phone: verifyData.phone } });
        if (!user || !user.otp || !user.otpExpiration) {
            throw new UnauthorizedException("شماره تلفن یا رمزعبور موقت معتبر نیست.");
        }
        const now = new Date();
        if (now > user.otpExpiration) {
            throw new UnauthorizedException("رمز عبور موقت منسوخ شده است.");
        }
        // Verify OTP
        if (verifyData.otp !== user.otp) {
            throw new UnauthorizedException("Invalid OTP");
        }
         // Clear OTP fields after successful verification
         user.otp = null;
         user.otpExpiration = null;
         await this.userRepository.save(user);
         const token = jwt.sign(
            { userId: user.id, phone: user.phone,role:user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return { message: "OTP verified successfully", token, user };
    }
}
