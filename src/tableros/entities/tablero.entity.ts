import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../auth/entities/user.entity';
import { Tableros_miembros } from './tablero.miembros.entity';

@Entity('tableros')
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
    @Column('timestamp')
    lastActivity: string;


    
    @OneToMany(
        () => Tableros_miembros,
        (tableros_miembros) => tableros_miembros.tablero,
        { cascade: true }
    )
    miembros: Tableros_miembros;


    @ManyToOne(
        () => User,
        ( user ) => user.tablero,
        { eager: true  }
    )
    user: User;

    
    @BeforeInsert()
    checkLastActivityInsert() {  
        this.lastActivity = this.getDate();
    }


    @BeforeUpdate()
    checkLastActivityUpdate() { 
        this.lastActivity = this.getDate();
    }

    private getDate(){
        const date = new Date();
        return date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+' '+("0" + date.getHours()).slice(-2)+':'+("0" + date.getMinutes()).slice(-2)+':'+date.getSeconds()+'.'+date.getMilliseconds(); 
    }

}
