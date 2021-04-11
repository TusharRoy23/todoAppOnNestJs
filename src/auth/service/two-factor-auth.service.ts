import { AuthService } from "./auth.service";
import * as config from 'config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../entity/user.entity";
import { UserRepository } from "../repository/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { authenticator } from "otplib";
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { JwtPayload } from "../interface/jwt-payload.interface";

const dbConfig = config.get('jwt');

@Injectable()
export class TwoFactorAuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private authService: AuthService
    ) {}

    public async generateTwoFactorAuthSecret(user: User) {
        const auth = await this.userRepository.getUserInfoByUsername(user.username);
        if (auth) {
            if (auth.isTwoFactorEnable) {
                return {
                    msg: 'Already QR generated'
                }
            }
        }

        const secret = authenticator.generateSecret();
        const app_name = process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME || dbConfig.twoFactorAppName;
        const otpAuthUrl = authenticator.keyuri(user.username, app_name, secret);

        await this.userRepository.update({ username: user.username }, { twoFactorAuthSecret: secret });
        return {
            secret,
            otpAuthUrl
        }
    }

    public async qrCodeStreamPipe(stream: Response, otpPathUrl: string) {
        return toFileStream(stream, otpPathUrl);
    }

    public async activationOfTwoFa(email: string, status: boolean) {
        return await this.userRepository.update({ username: email }, {
            isTwoFactorEnable: status
        });
    }

    public async verifyTwoFaCode(code: string, user: User) {
        return authenticator.verify({
            token: code,
            secret: user.twoFactorAuthSecret
        });
    }

    async signIn(user: User, isTwoFaAuthenticated: boolean): Promise<{ accessToken: string, refreshToken: string, user: JwtPayload }> {
        const data = {
            isTwoFaAuthenticated,
            isTwoFactorEnable: user.isTwoFactorEnable,
            username: user.username,
            user_info: user.user_info
        }
        const accessToken = await this.authService.getAccessToken(data);
        const refreshToken = await this.authService.getRefreshToken(data);

        await this.authService.updateRefreshTokenInUser(refreshToken, user.username);

        return {
            accessToken,
            refreshToken,
            user: {
                username: user.username,
                user_info: user.user_info
            }
        };
    }
}