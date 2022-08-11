import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'; 
import { Tablero } from './entities/tablero.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Tableros_miembros } from './entities/tablero.miembros.entity';
import { AddMiembroTableroDto,AddListaTableroDto,AddCardListaTableroDto, MoveCardDto,CreateTableroDto,UpdateTableroDto } from './dto/'; 

import { Tableros_listas } from './entities/tablero.listas.entity';
import { Tableros_listas_cards } from './entities';
@Injectable()
export class TablerosService {
  private readonly logger = new Logger('TablerosService');

  constructor(
    @InjectRepository(Tablero)
    private readonly tableroRepository: Repository<Tablero>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tableros_miembros)
    private readonly tableroMienRepository: Repository<Tableros_miembros>,

    @InjectRepository(Tableros_listas)
    private readonly tableroListRepository: Repository<Tableros_listas>,

    @InjectRepository(Tableros_listas_cards)
    private readonly tableroListCardRepository: Repository<Tableros_listas_cards>,
  ){

  }

  async create(createTableroDto: CreateTableroDto,user: User) {
    
    try {
     const tablero = this.tableroRepository.create({
      ...createTableroDto,
      user
     });
      await this.tableroRepository.save(tablero);
      const tableroMienbro = await this.tableroMienRepository.create({
        miembro:user,
        tablero:tablero
      });
      await this.tableroMienRepository.save(tableroMienbro);

      return  this.findOne(tablero.id);
    } catch (error) {
      this.handleDBExceptions(error); 
    }

  }

  findAll(userId:string) { 
    const tableros = this.tableroRepository.find({
      where: {
        user:{
          id:userId
        }
      }
    });
    return tableros;
  }

  async agregarMiembro(id:string,addMiembroTableroDto: AddMiembroTableroDto) { 
    let emailUser = await this.userRepository.findOneBy({email:addMiembroTableroDto.email});
    if(!emailUser)  throw new NotFoundException(`No existe un usuario con el correo ${ addMiembroTableroDto.email }`);
    let tablero = await this.tableroRepository.findOneBy({id});

    let finMashUserTablero = await this.finMashUserTablero(emailUser.id,tablero.id)
    if(finMashUserTablero) throw new BadRequestException(`Este usuario ya fue agregado a este tablero`)
    
    const tableroMienbro = await this.tableroMienRepository.create({
      miembro:emailUser,
      tablero:tablero
    });
    await this.tableroMienRepository.save(tableroMienbro);
    await this.updateForLastUpdate(id);
    return this.findOne(id);
  }

  
  async agregarLista(id:string,descripcion: AddListaTableroDto) {   
    let tablero = await this.tableroRepository.findOneBy({id}); 
    if(!tablero) throw new BadRequestException(`El tablero no existe `)
     const list = await this.tableroListRepository.create({
      ...descripcion,
      tablero
     });
     await this.tableroListRepository.save(list);
     delete list.tablero;
     return list;
  }

  
  async agregarCard(id:string,data: AddCardListaTableroDto) {   
    let tableros_listas = await this.tableroListRepository.findOneBy({id}); 
    if(!tableros_listas) throw new BadRequestException(`La lista no existe `)
     const card = await this.tableroListCardRepository.create({
      title:data.title,
      position:data.position,
      tableros_listas
     });
     await this.tableroListCardRepository.save(card);
     delete card.tableros_listas;
     return card;
  }

  
  async actializarCard(id:string,newcard: AddCardListaTableroDto) {   
    let card = await this.tableroListCardRepository.findOneBy({id}); 
    if(!card) throw new BadRequestException(`El Card no existe `) 
    let updated = Object.assign(card, newcard);  
    await this.tableroListCardRepository.save(updated); 
    return updated;
  }

  
  async moveCard(cardMove: MoveCardDto) {   
    let card = await this.tableroListCardRepository.findOneBy({id:cardMove.id_card}); 
    if(!card) throw new BadRequestException(`El Card no existe `) 

    
    let list = await this.tableroListRepository.findOneBy({id:cardMove.id_list}); 
    if(!list) throw new BadRequestException(`El List no existe `) 

    
    card.tableros_listas = list;
    await this.tableroListCardRepository.save(card); 
    return card;
  }

  
  async actualizarLista(id:string,descripcion: AddListaTableroDto) {   
    let lista = await this.tableroListRepository.findOneBy({id});
    if ( !lista ) throw new NotFoundException(`La lista con el id: ${ id } no existe`); 
    let updated = Object.assign(lista, descripcion); 
    return this.tableroListRepository.save(updated); 
  }
  
  async eliminarLista(id:string) {   
    let lista = await this.tableroListRepository.findOneBy({id});
    if ( !lista ) throw new NotFoundException(`La lista con el id: ${ id } no existe`);  
    const result = await this.tableroListRepository.delete({id});

    return result.affected>0 ?{ statusCode:200 } : { statusCode:500 }
  }

  async obtenerListas(id:string) {   
    let tablero = await this.tableroRepository.findOneBy({id}); 
    if(!tablero) throw new BadRequestException(`El tablero no existe `);
 
    return  await this.tableroListRepository.find({ 
      select: ['descripcion','id', 'tablero'],
      where:{
        estado:true,
        tablero:{
          id:tablero.id
        }
      },
      relations:{ 
        cards:true
      },
      order:{
        position: "ASC"
      }
      
     })
  }
  
  async obtenerCard(id:string) {   
    let list = await this.tableroListRepository.findOneBy({id}); 
    if(!list) throw new BadRequestException(`La lista no existe `);
 
    return  await this.tableroListCardRepository.find({ 
      select: ['id','description','dueDate','title','position','estado'],
      where:{
        estado:true,
        tableros_listas:{
          id:list.id
        }
      }
     })
  }

  async finMashUserTablero(idUser: string,idTablero:string) {
    const queryBuilder = this.tableroMienRepository.createQueryBuilder('tableros_miembros'); 
    const tableroMienbros = await queryBuilder
        .where('tableros_miembros.miembro=:idUser AND tableros_miembros.tablero=:idTablero', {
          idUser,idTablero
        }) 
        .getOne();
        return tableroMienbros;

  }
  
  async findOne(id: string) {
    
    const queryBuilder = this.tableroRepository.createQueryBuilder('tablero'); 
    const tablero:Tablero = await queryBuilder
        .where('tablero.id=:id', {
          id,
        })
        .leftJoinAndSelect('tablero.miembros','tableros_miembros')
        .leftJoinAndSelect('tableros_miembros.miembro','users')
        .leftJoinAndSelect('tablero.lista','tableros_listas')
        .leftJoinAndSelect('tableros_listas.cards','tableros_listas_cards')
        .getOne();
        return tablero;

  }

  findOneComplete(id: string) {
    return this.tableroRepository.findOneBy({ id });
  }

  async update(id: string, updateTableroDto: UpdateTableroDto,user: User) {
    let tablero = await this.findOne(id);
    if ( !tablero ) throw new NotFoundException(`El tablero con el id: ${ id } no existe`);
    if(tablero.user.id!==user.id) throw new NotFoundException(`Solo ${ tablero.user.fullName } puede actualizar este registro`);
    let updated = Object.assign(tablero, updateTableroDto); 
    return this.tableroRepository.save(updated); 
  }

  remove(id: string) {
    return `This action removes a #${id} tablero`;
  }


  async updateForLastUpdate(id:string){
    let tablero = await this.findOne(id);
    let updated = Object.assign(tablero, tablero);  
    return this.tableroRepository.save(updated); 
  }


  
  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Error inesperado, Favor revisar');

  }
}
