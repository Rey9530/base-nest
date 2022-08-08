import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { TablerosService } from './tableros.service';
import { CreateTableroDto } from './dto/create-tablero.dto';
import { UpdateTableroDto } from './dto/update-tablero.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { AddMiembroTableroDto } from './dto/add-mienbro-tablero.dto';

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
