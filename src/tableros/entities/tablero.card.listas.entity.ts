import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";  
import { Tableros_listas } from './';

@Entity('tableros_listas_cards')
export class Tableros_listas_cards {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text')
    title: string;

    
    @ApiProperty()
    @Column('numeric',{
        default:0
    })
    position: number;


    @ApiProperty()
    @Column('text',{
        default:'',
    })
    description: string;

    @ApiProperty()
    @Column('bool',{
        default:true
    })
    estado: boolean;
    
    
    @ApiProperty()
    @Column('timestamp')
    dueDate: string;

    
    @ManyToOne(
        () => Tableros_listas,
        ( tableros_listas ) => tableros_listas.cards,
        {    }
    )
    tableros_listas: Tableros_listas;


    
    @BeforeInsert()
    checkLastActivityInsert() {  
        let fecha= this.getDate() 
        this.dueDate =fecha;

    }


    @BeforeUpdate()
    checkLastActivityUpdate() {
        if(this.description == null ){
            this.description = '';
        }
    }

    private getDate(){
        const date = new Date(); 
        return date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+' '+("0" + date.getHours()).slice(-2)+':'+("0" + date.getMinutes()).slice(-2)+':'+("0" + date.getSeconds()).slice(-2)+'.'+date.getMilliseconds(); 
    }

}
