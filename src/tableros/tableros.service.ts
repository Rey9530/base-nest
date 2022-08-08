import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTableroDto } from './dto/create-tablero.dto';
import { UpdateTableroDto } from './dto/update-tablero.dto';
import { Tablero } from './entities/tablero.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Tableros_miembros } from './entities/tablero.miembros.entity';
import { AddMiembroTableroDto } from './dto/add-mienbro-tablero.dto';

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
