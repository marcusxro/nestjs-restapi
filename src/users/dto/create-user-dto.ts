import { IsString
    , IsEnum, IsNotEmpty } from "class-validator"; //class-validator class-transformer

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEnum(['ADMIN', 'USER'], {
        message: 'Valid roles are ADMIN or USER'
    })
    @IsString()
    @IsNotEmpty()
    role: 'ADMIN' | 'USER';

}