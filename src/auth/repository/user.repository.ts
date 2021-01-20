import { EntityRepository, Repository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'

import { SignupCredentialsDto } from "../dto/signup-credentials.dto";
import { SignInCredentialsDto } from "../dto/signin-credentials.dto";
import { User } from "../entity/user.entity";
import { UserInfo } from "../../user/entity/user-info.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(signupCredentialsDto: SignupCredentialsDto): Promise<{ message: string }> {
        const { username, password } = signupCredentialsDto

        const user = new User()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        
        try {
            const userInfo = new UserInfo()
            await userInfo.save()

            user.user_info = userInfo
            await user.save()

            return { message: 'User successfully created !' }
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(signinCredentialDto: SignInCredentialsDto): Promise <JwtPayload> {
        const { username, password } = signinCredentialDto
        const auth = await this.findOne({ username })

        if (auth && await auth.validatePassword(password)) {
            return {
                username: auth.username,
                user_info: auth.user_info
            }
        } else {
            return null
        }
    }



    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}