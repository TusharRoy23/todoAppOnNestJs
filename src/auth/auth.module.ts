import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt-strategy';
import { JwtRefreshStrategy } from './jwt-refresh-strategy';

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
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtRefreshStrategy
    ],
    exports: [
        JwtStrategy,
        JwtRefreshStrategy,
        PassportModule
    ]
})
export class AuthModule {}
