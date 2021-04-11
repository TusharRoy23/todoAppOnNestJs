import { UserInfo } from "../../user/entity/user-info.entity";
import { User } from "../entity/user.entity";

export interface JwtPayload {
    isTwoFactorEnable?: boolean
    username: string
    user_info: UserInfo
    isTwoFaAuthenticated?: boolean
}