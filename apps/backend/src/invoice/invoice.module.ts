// src/invoice/invoice.module.ts
import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
