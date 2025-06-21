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
import { DashboardModule } from './dashboard/dashboard.module';
import { InvoiceModule } from './invoice/invoice.module';
import { StockPrevModule } from './stock-prev/stock-prev.module';
import { AvisModule } from './avis/avis.module';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, UserModule, ProduitModule, CollectionModule, CloudinaryModule, CommandeModule, DashboardModule, InvoiceModule, StockPrevModule, AvisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
