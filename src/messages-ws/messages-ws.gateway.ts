import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service'; 

@WebSocketGateway({ cors:true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
    ) {}
  
  @WebSocketServer() wss :Server;

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeCliente(client.id); 
  }
  
  async handleConnection(client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      
      payload = this.jwtService.verify(token );
      await this.messagesWsService.registerCliente(client,payload.id);
    } catch (error) {
      client.disconnect()
      return;
    }

     
    this.wss.emit('cliente-update',this.messagesWsService.getClienteConnectedsd())
  }


  @SubscribeMessage('message-from-cliente')
  hanleMessageFromCliente(client:Socket,payload:NewMessageDto){ 
    //! Emitir a todos menos al cliente inicial
    // client.emit('message-from-serve',{
    //   fullName:'Soy yo',
    //   message:payload.message || 'no-message'
    // })

    client.broadcast.emit('message-from-serve',{
      fullName:this.messagesWsService.getUserFullName(client.id),
      message:payload.message || 'no-message'
    })
  }
}
