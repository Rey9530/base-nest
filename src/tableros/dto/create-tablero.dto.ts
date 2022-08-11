import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateTableroDto {

    
    @ApiProperty()
    @IsString({message:'El titulo es requerido'})
    @MinLength(3,{ message:'El titulo No debe ser menor a 3 caracteres' })
    title: string;

    
    @ApiProperty()
    @IsString({message:'La description es requerida'}) 
    description: string;

    @ApiProperty()
    @IsString({message:'La description es requerida'}) 
    icon: string;

}
