import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6,{message:'Debe ser mayor a 6 caracteres'})
    @MaxLength(50,{message:'Debe ser menor a 50 caracteres'})
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número'
    })
    password: string;

    
    @ApiProperty()
    @IsString()
    @MinLength(1)
    fullName: string;

}