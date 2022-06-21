import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../auth/entity/user.entity";
import { UserInfoDto } from "../dto/user-info.dto";
import { UserInfo } from "../entity/user-info.entity";
import { userInfoData } from "../interface/user-info.interface";
import { UserInfoRepository } from "../repository/user-info.repository";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>
    ) {}

    async getUser(
        user: Partial<User>
    ): Promise<UserInfo> {
        const userInfoId = user.user_info.id;
        const userInfo = await this.userInfoRepository.findOne({ where : { id: userInfoId } })

        if (!userInfo) {
            throw new NotFoundException("User not found.");
        }
        return userInfo
    }

    async updateUserProfile(
        user: Partial<User>,
        userInfoDto: UserInfoDto
    ): Promise<userInfoData> {
        const userInfo = await this.getUser(user)
        
        if (userInfoDto.address) userInfo.address = userInfoDto.address
        if (userInfoDto.petName) userInfo.petName = userInfoDto.petName
        if (userInfoDto.photo) userInfo.photo = userInfoDto.photo
        if (userInfoDto.modified_photo) userInfo.modified_photo = userInfoDto.modified_photo
        
        await this.userInfoRepository.save(userInfo);
        return {...userInfo, username: user.username};
    }
}