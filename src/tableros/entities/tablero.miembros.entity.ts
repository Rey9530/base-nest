import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../auth/entities/user.entity';
import { Tablero } from 'src/tableros/entities/tablero.entity';

@Entity('tableros_miembros')
export class Tableros_miembros {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty()
    @Column('timestamp')
    fechaCreacion: string;

    
    @ApiProperty()
    @Column('bool',{
        default:true
    })
    estado: boolean;

    @ManyToOne(
        () => User,
        ( user ) => user.miembro,
        { eager: true  }
    )
    miembro: User;

 
    @ManyToOne(
        () => Tablero,
        ( tablero ) => tablero.miembros,
        { eager: true  }
    )
    tablero: Tablero;


    
    @BeforeInsert()
    checkLastActivityInsert() {  
        let fecha= this.getDate()
        console.log(fecha)
        this.fechaCreacion =fecha;
    }


    @BeforeUpdate()
    checkLastActivityUpdate() { 
        let fecha= this.getDate()
        console.log(fecha)
        this.fechaCreacion =fecha;
    }

    private getDate(){
        const date = new Date(); 
        return date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+' '+("0" + date.getHours()).slice(-2)+':'+("0" + date.getMinutes()).slice(-2)+':'+("0" + date.getSeconds()).slice(-2)+'.'+date.getMilliseconds(); 
    }

}
