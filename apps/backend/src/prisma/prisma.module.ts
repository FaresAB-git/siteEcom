import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //rend le modul accessible partout sans avoir a le mettre dans chaque module manuellement
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //permet d'utiliser le module ailleurs
})
export class PrismaModule {}
