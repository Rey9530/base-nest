import { Module } from '@nestjs/common';
import { TablerosService } from './tableros.service';
import { TablerosController } from './tableros.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tablero } from './entities/tablero.entity';
import { Tableros_miembros } from './entities/tablero.miembros.entity';

@Module({
  controllers: [TablerosController],
  providers: [TablerosService],
  imports:[
    TypeOrmModule.forFeature([ Tablero,Tableros_miembros ]),
    AuthModule
  ],
  exports:[
    TypeOrmModule
  ]
})
export class TablerosModule {}
