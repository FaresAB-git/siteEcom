
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Commande, CommandeProduit } from '@prisma/client';
import { WritableBufferStream } from '../../utils/writable-buffer-stream';
import { Decimal } from 'decimal.js';

@Injectable()
export class InvoiceService {
  async generateInvoicePdf(commande: Commande, produits: CommandeProduit[]): Promise<Buffer> {
    const doc = new PDFDocument();
    const stream = new WritableBufferStream();
    doc.pipe(stream);

    doc.fontSize(18).text(`Facture - Commande #${commande.id}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Client : ${commande.clientEmail}`);
    doc.text(`Adresse : ${commande.adresse}`);
    doc.text(`Total : ${commande.total} €`);
    doc.moveDown();

    doc.fontSize(14).text('Produits :');
    doc.moveDown();

    produits.forEach((p) => {
        const quantite = p.quantite; 
        const prixUnitaire = (p.prixUnitaire as Decimal).toNumber(); // convertir Decimal
        const totalProduit = quantite * prixUnitaire;

        doc.text(
            `- Produit ID: ${p.produitId} | Quantité: ${quantite} | Prix unitaire: ${prixUnitaire} € | Total: ${totalProduit} €`,
        );
    });

    doc.end();

    const buffer = await stream.getBuffer();
    return buffer;
  }
}
