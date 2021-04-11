import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from "../interface/jwt-payload.interface";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "../service/auth.service";

import * as config from 'config'

const dbConfig = config.get('jwt')

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private authService: AuthService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET || dbConfig.refreshSecret
        })
    }

    async validate(payload: JwtPayload) {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException();
        }

        if (!user.isTwoFactorEnable) {
            return user;
        }

        if (payload.isTwoFaAuthenticated) {
            return user;
        }
    }
}