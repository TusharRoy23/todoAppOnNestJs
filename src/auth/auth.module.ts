import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh-strategy';
import { TwoFactorAuthService } from './service/two-factor-auth.service';
import { TwoFactorAuth } from './controller/two-factor-auth.controller';
import { JwtTwoFaStrategy } from './strategy/jwt-2fa-strategy';

// import * as config from 'config'

// const dbConfig = config.get('jwt')

@Global()
@Module({
    imports: [
        // PassportModule.register({ defaultStrategy: 'jwt' }),
        // JwtModule.register({
        //     secret: process.env.JWT_ACCESS_TOKEN_SECRET || dbConfig.secret,
        //     signOptions: {
        //         expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || dbConfig.secret
        //     }
        // }),
        PassportModule.register({}),
        JwtModule.register({}),
        TypeOrmModule.forFeature([UserRepository])
    ],
    controllers: [AuthController, TwoFactorAuth],
    providers: [
        AuthService,
        TwoFactorAuthService,
        JwtStrategy,
        JwtRefreshStrategy,
        JwtTwoFaStrategy
    ],
    exports: [
        JwtStrategy,
        JwtRefreshStrategy,
        PassportModule,
        JwtTwoFaStrategy
    ]
})
export class AuthModule {}
