// src/invoice/invoice.controller.ts
import { Controller, Get, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('test-invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
    async testInvoice(@Res() res: Response) {
    const commande = await this.prisma.commande.findFirst();

    if (!commande) {
        throw new NotFoundException('Aucune commande trouvée.');
    }

    const produits = await this.prisma.commandeProduit.findMany({
        where: { commandeId: commande.id },
    });
    console.log(produits);

    const pdfBuffer = await this.invoiceService.generateInvoicePdf(commande, produits);
    console.log(pdfBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=facture.pdf');
    res.send(pdfBuffer);
    }

}
