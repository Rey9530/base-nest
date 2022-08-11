import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

import { TablerosService } from './tableros.service';

import { AddMiembroTableroDto,AddListaTableroDto,AddCardListaTableroDto,CreateTableroDto,UpdateTableroDto, MoveCardDto } from './dto/';  

@Controller('tableros')
@Auth()
export class TablerosController {
  constructor(private readonly tablerosService: TablerosService) {}

  @Post()
  create(
    @Body() createTableroDto: CreateTableroDto,
    @GetUser() user: User,
  ) {
    return this.tablerosService.create(createTableroDto,user);
  }
  
  @Post('agregar_miembro/:id')
  agregarMiembro(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() addMiembroTableroDto: AddMiembroTableroDto, 
  ) {
    return this.tablerosService.agregarMiembro(id,addMiembroTableroDto); 
  }
  

  
  @Post('listas/:id')
  agregarLista(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() addList: AddListaTableroDto, 
  ) {
    return this.tablerosService.agregarLista(id,addList); 
  }

  
  @Post('cards/:id')
  agregarCard(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() addCard: AddCardListaTableroDto, 
  ) {
    return this.tablerosService.agregarCard(id,addCard); 
  }

  @Put('cards/:id')
  actializarCard(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() addCard: AddCardListaTableroDto, 
  ) {
    return this.tablerosService.actializarCard(id,addCard); 
  }

  @Put('move_cards')
  moveCard( 
    @Body() cardMove: MoveCardDto, 
  ) {
    return this.tablerosService.moveCard(cardMove); 
  }
  
  @Get('cards/:id')
  obtenerCard(
    @Param('id', ParseUUIDPipe) id: string,  
  ) {
    return this.tablerosService.obtenerCard(id); 
  }

  
  @Put('listas/:id')
  actualizarLista(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() addList: AddListaTableroDto, 
  ) {
    return this.tablerosService.actualizarLista(id,addList); 
  }

  
  @Delete('listas/:id')
  eliminarLista(
    @Param('id', ParseUUIDPipe) id: string,  
  ) {
    return this.tablerosService.eliminarLista(id); 
  }

  @Get('listas/:id')
  obtenerLista(
    @Param('id', ParseUUIDPipe) id: string,  
  ) {
    return this.tablerosService.obtenerListas(id); 
  }


  @Get()
  findAll(
    @GetUser() user: User,
  ) {
    return this.tablerosService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablerosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTableroDto: UpdateTableroDto,
    @GetUser() user: User,
    ) {
    return this.tablerosService.update(id, updateTableroDto,user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablerosService.remove(id);
  }
}
