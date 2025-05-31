import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // Pour s'e servir d'en le module commande
})
export class MailModule {}
