import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TablerosService } from './tableros.service';
import { CreateTableroDto } from './dto/create-tablero.dto';
import { UpdateTableroDto } from './dto/update-tablero.dto';

@Controller('tableros')
export class TablerosController {
  constructor(private readonly tablerosService: TablerosService) {}

  @Post()
  create(@Body() createTableroDto: CreateTableroDto) {
    return this.tablerosService.create(createTableroDto);
  }

  @Get()
  findAll() {
    return this.tablerosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablerosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableroDto: UpdateTableroDto) {
    return this.tablerosService.update(+id, updateTableroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablerosService.remove(+id);
  }
}
