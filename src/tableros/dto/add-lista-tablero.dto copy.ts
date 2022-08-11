import { ApiProperty } from "@nestjs/swagger";
import {  IsString,  IsUUID,  MinLength } from "class-validator";

export class MoveCardDto {

    
    @ApiProperty()
    @IsString({message:'El id_card es requerido'}) 
    @IsUUID()
    id_card: string;

    
    @ApiProperty()
    @IsString({message:'El id_list es requerido'}) 
    @IsUUID()
    id_list: string;
     

}
