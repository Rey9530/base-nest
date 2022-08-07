import { ApiProperty } from "@nestjs/swagger";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Tablero {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    @ApiProperty()
    @Column('text')
    title: string;

    
    @ApiProperty()
    @Column('text')
    description: string;

    @ApiProperty()
    @Column('text')
    icon: string;
    
    @ApiProperty()
    @Column('datetime')
    lastActivity: string;

    
    @ApiProperty()
    @Column('text',{
        array:true,
        nullable:true
    })
    members: string[];

    

}
