import { ApiProperty } from "@nestjs/swagger";
import {  IsNumber, IsOptional, IsPositive, IsString,  MinLength } from "class-validator";

export class AddCardListaTableroDto { 
    
    @ApiProperty()
    @IsString({message:'El title es requerido'}) 
    @MinLength(2,{ message:'El title minimo de 3 caracteres' })
    title: string; 
 
    @IsOptional()
    @IsNumber() 
    @IsOptional()
    position?: number; 

    
    @ApiProperty()
    @IsString({message:'El description es cadena de texto'}) 
    @MinLength(2,{ message:'El description minimo de 3 caracteres' })
    @IsOptional()
    description?: string; 

    
    @ApiProperty()
    @IsString({message:'Fecha de vencimiento es cadena de texto'}) 
    @MinLength(2,{ message:'Fecha de vencimiento minimo de 3 caracteres' })
    @IsOptional()
    dueDate?: string; 

}
