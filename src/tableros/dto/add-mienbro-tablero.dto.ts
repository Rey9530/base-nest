import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID } from "class-validator";

export class AddMiembroTableroDto {

    
    @ApiProperty()
    @IsString({message:'El miembro es requerido'})
    @IsEmail({
        IsEmail:true
    }, {message:'Correo incorrecto' })
    email: string;
     

}
