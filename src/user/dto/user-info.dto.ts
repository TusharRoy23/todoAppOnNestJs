import { ApiProperty } from "@nestjs/swagger"

export class UserInfoDto {
    @ApiProperty({
        required: false
    })
    petName: string

    @ApiProperty({
        type: 'file',
        properties: {
            file: {
                type: 'string',
                format: 'binary'
            }
        },
        required: false
    })
    photo: string
    
    @ApiProperty({
        required: false
    })
    modified_photo: string

    @ApiProperty({
        required: false
    })
    address: string
}