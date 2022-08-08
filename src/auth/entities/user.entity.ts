import { ApiProperty } from '@nestjs/swagger';
import { Tablero } from 'src/tableros/entities/tablero.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'; 
import { Tableros_miembros } from '../../tableros/entities/tablero.miembros.entity';

@Entity('users')
export class User {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty()
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty()
    @Column('text')
    fullName: string;

    

    @ApiProperty()
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]; 
    
    @ApiProperty()
    @Column('text',{
        nullable:true
    })
    avatar: string;
 
    @OneToMany(
        () => Tablero,
        (tablero) => tablero.user,
        { cascade: true }
    )
    tablero: Tablero;

    
    @OneToMany(
        () => Tableros_miembros,
        (tableros_miembros) => tableros_miembros.miembro,
        { cascade: true }
    )
    miembro: Tableros_miembros;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}
