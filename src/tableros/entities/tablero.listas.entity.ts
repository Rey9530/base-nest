import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"; 
import { Tablero,Tableros_listas_cards } from "./";

@Entity('tableros_listas')
export class Tableros_listas {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text')
    descripcion: string;

    
    @ApiProperty()
    @Column('numeric',{
        default:0
    })
    position: number;


    @ApiProperty()
    @Column('bool',{
        default:true
    })
    estado: boolean;
    
    
    @ApiProperty()
    @Column('timestamp')
    fechaCreacion: string;

    
    @ManyToOne(
        () => Tablero,
        ( tablero ) => tablero.lista,
        { eager: false  }
    )
    tablero: Tablero;

    
    @OneToMany(
        () => Tableros_listas_cards,
        (tableros_listas_cards) => tableros_listas_cards.tableros_listas,
        { cascade: true }
    )
    cards: Tableros_listas_cards;


    
    @BeforeInsert()
    checkLastActivityInsert() {  
        let fecha= this.getDate() 
        this.fechaCreacion =fecha;
    }


    @BeforeUpdate()
    checkLastActivityUpdate() { 
        let fecha= this.getDate() 
        this.fechaCreacion =fecha;
    }

    private getDate(){
        const date = new Date(); 
        return date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+' '+("0" + date.getHours()).slice(-2)+':'+("0" + date.getMinutes()).slice(-2)+':'+("0" + date.getSeconds()).slice(-2)+'.'+date.getMilliseconds(); 
    }

}
