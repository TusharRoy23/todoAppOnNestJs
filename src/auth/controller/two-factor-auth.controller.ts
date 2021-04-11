import { Body, ClassSerializerInterceptor, Controller, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt-authentication.guard";
import { GetUser } from "../decorator/get-user.decorator";
import { User } from "../entity/user.entity";
import { TwoFactorAuthService } from "../service/two-factor-auth.service";
import { Response } from 'express';
import { TwoFaAuthDto } from "../dto/two-fa-auth.dto";

@ApiTags('Two FA')
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuth {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService
    ) {}
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthenticationGuard)
    @Post('generate-qr')
    async generateQrCode(
        @Res() response: Response, @GetUser() user: User
    ) {
        const { otpAuthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
        response.setHeader('content-type','image/png');
        return this.twoFactorAuthService.qrCodeStreamPipe(response, otpAuthUrl);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthenticationGuard)
    @Post('turn-on-qr')
    async activationOfTwoFa(
        @GetUser() user: User,
        @Body(ValidationPipe) twoFaAuthDto: TwoFaAuthDto
    ) {
        const isCodeValid = this.twoFactorAuthService.verifyTwoFaCode(twoFaAuthDto.code, user);
        if (!isCodeValid) {
            throw new UnauthorizedException('Invalid authentication code');
        }
        await this.twoFactorAuthService.activationOfTwoFa(user.username, true);
    }

    // This function will be called if 2FA is on (activationOfTwoFa method)
    @ApiBearerAuth()
    @Post('authenticate')
    @UseGuards(JwtAuthenticationGuard)
    async authenticate(
        @GetUser() user: User,
        @Body(ValidationPipe) twoFaAuthDto: TwoFaAuthDto
    ) {
        const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(twoFaAuthDto.code, user);
        if (!isCodeValid) {
            throw new UnauthorizedException('Invalid authentication code');
        }
        return await this.twoFactorAuthService.signIn(user, true);
    }
}