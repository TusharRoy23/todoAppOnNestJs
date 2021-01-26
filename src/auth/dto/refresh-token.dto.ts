import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refresh_token: string
}