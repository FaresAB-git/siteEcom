// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({  
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    });
  }

  async sendInvoiceEmail(to: string, pdfBuffer: Buffer, commandeId: number) {
    const mailOptions = {
      from: `"Ma Boutique" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Facture Commande #${commandeId}`,
      text: `Bonjour, veuillez trouver en pièce jointe la facture de votre commande #${commandeId}.`,
      attachments: [
        {
          filename: `facture-commande-${commandeId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };


    return this.transporter.sendMail(mailOptions);
  }
}
