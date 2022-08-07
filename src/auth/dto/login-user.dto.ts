import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto {

    
    @ApiProperty()
    @IsString({message:'El correo Electronico es requerido'})
    @IsEmail({message:'El correo no es valido'})
    email: string;

    
    @ApiProperty()
    @IsString({message:'El password es requerido'})
    // @MinLength(6)
    // @MaxLength(50)
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'The password must have a Uppercase, lowercase letter and a number'
    // })
    password: string;

}