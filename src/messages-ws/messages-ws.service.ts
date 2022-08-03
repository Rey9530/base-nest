import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

interface ContecteCliente{
    [id:string] : {
        socket:Socket,
        user:User,
    }
}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){

    }

    private connecteClientes:ContecteCliente= {};
    async registerCliente(cliente:Socket, id:string){

        const user= await this.userRepository.findOneBy({ id })
        if( !user ) throw new Error("Usuario No encontrado");
        if( !user.isActive ) throw new Error("Usuario No Activo");
        
        this.checkUserConneccion(user);

        this.connecteClientes[cliente.id] ={
            socket:cliente,
            user
        };
    }

    
    removeCliente(clienteId:string){
        delete this.connecteClientes[clienteId];
    }

    getClienteConnectedsd():string[]{
        return Object.keys(this.connecteClientes);
    }

    getUserFullName(socketId:string){
        return this.connecteClientes[socketId].user.fullName;
    }

    private checkUserConneccion(user:User){
        for (const clientId of Object.keys( this.connecteClientes )) {
            const conectedClient = this.connecteClientes[clientId];
            if(conectedClient.user.id===user.id){
                conectedClient.socket.disconnect()
                break;
            }

        }
    }

}
