import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProduitModule } from './produit/produit.module';
import { CollectionModule } from './collection/collection.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommandeModule } from './commande/commande.module';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, UserModule, ProduitModule, CollectionModule, CloudinaryModule, CommandeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
