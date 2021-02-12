import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class AdminSignInDto {
    @IsString()
    email: string

    @ApiProperty({ minimum: 6, maximum: 20, description: 'At least 1 capital, 1 small, 1 special character & 1 number' })
    @IsString()
    password: string
}