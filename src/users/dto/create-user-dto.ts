import { IsString, IsInt, IsEnum, IsNotEmpty } from "class-validator"; //class-validator class-transformer



export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEnum(['ADMIN', 'USER'], {
        message: 'Valid roles are ADMIN or USER'
    })
    @IsNotEmpty()
    role: 'ADMIN' | 'USER';

}