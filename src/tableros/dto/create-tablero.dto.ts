import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateTableroDto {

    
    @ApiProperty()
    @IsString({message:'El titulo es requerido'})
    @MinLength(3,{ message:'El titulo No debe ser menor a 3 caracteres' })
    title: string;

    
    @ApiProperty()
    @IsString({message:'La description es requerida'})
    @MinLength(5,{ message:'La description No debe ser menor a 3 caracteres' })
    description: string;

    @ApiProperty()
    @IsString({message:'La description es requerida'}) 
    icon: string;

}
