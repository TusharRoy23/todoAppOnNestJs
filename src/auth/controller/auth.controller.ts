import { Post, Body, ValidationPipe, Controller, Get, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthenticationGuard } from "src/guards/jwt-authentication.guard"
import { JwtRefreshTokenGuard } from "src/guards/jwt-refresh-token.guard"
import { JwtTwoFactorGuard } from "src/guards/jwt-two-factor.guard"
import { GetUser } from "../decorator/get-user.decorator"
import { RefreshTokenDto } from "../dto/refresh-token.dto"
import { SignInCredentialsDto } from "../dto/signin-credentials.dto"
import { SignupCredentialsDto } from "../dto/signup-credentials.dto"
import { User } from "../entity/user.entity"
import { JwtPayload } from "../interface/jwt-payload.interface"
import { AuthService } from "../service/auth.service"

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    
    @Post('/signup')
    signUp(
        @Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto
    ): Promise<{ message: string }> {
        return this.authService.signUp(signupCredentialsDto)
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) signinCredentialsDto: SignInCredentialsDto
    ): Promise<{ accessToken: string, refreshToken?: string, user?: JwtPayload }>{
        return this.authService.signIn(signinCredentialsDto);
    }

    @ApiBearerAuth()
    // @UseGuards(JwtAuthenticationGuard)
    @UseGuards(JwtTwoFactorGuard)
    @Get('/logout')
    logout(
        @GetUser() user: User
    ) {
        this.authService.signOut(user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtRefreshTokenGuard)
    @Post('/refresh-token')
    async refreshToken(
        @GetUser() user: User,
        @Body() token: RefreshTokenDto
    ){
        const user_info = await this.authService.getUserIfRefreshTokenMatches(token.refresh_token, user.username)
        if (user_info) {
            const userInfo = {
                username: user_info.username,
                user_info: user_info.user_info
            }

            if (user.isTwoFactorEnable) {
                userInfo['isTwoFaAuthenticated'] = true;
                userInfo['isTwoFactorEnable'] = user.isTwoFactorEnable;
                
            }

            return this.authService.getNewAccessAndRefreshToken(userInfo)
        } else{
            return null
        }
    }
}