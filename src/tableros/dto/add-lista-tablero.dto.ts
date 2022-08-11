import { ApiProperty } from "@nestjs/swagger";
import {  IsNumber, IsString,  MinLength } from "class-validator";

export class AddListaTableroDto {

    
    @ApiProperty()
    @IsString({message:'El miembro es requerido'}) 
    @MinLength(2,{ message:'Minimo de 3 caracteres' })
    descripcion: string;

    
    @ApiProperty()
    @IsNumber()  
    position: number;
     

}
