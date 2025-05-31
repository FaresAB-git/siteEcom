import { Module } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CommandeController } from './commande.controller';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [InvoiceModule, MailModule],
  controllers: [CommandeController],
  providers: [CommandeService],
})
export class CommandeModule {}
