import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt-strategy';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: +process.env.APP_EXPIRES
            }
        }),
        TypeOrmModule.forFeature([UserRepository])
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy
    ],
    exports: [
        JwtStrategy,
        PassportModule
    ]
})
export class AuthModule {}
