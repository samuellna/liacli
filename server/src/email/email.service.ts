import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  buildApprovalEmailHtml,
  buildRejectionEmailHtml,
  buildResultEmailHtml,
  buildSchedulingRequestEmailHtml,
} from './email.templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendApprovalEmail(params: {
    toEmail: string;
    pesquisadorNome: string;
    protocolo: string;
    dataAgendada: Date;
  }): Promise<void> {
    const dataFormatada = params.dataAgendada.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const html = buildApprovalEmailHtml({
      pesquisadorNome: params.pesquisadorNome,
      protocolo: params.protocolo,
      dataAgendada: dataFormatada,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: params.toEmail,
        subject: `LIACLI - Confirmação de Agendamento`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email de aprovação para ${params.toEmail}: ${String(error)}`,
      );
    }
  }

  async sendSchedulingRequestEmail(params: {
    toEmail: string;
    pesquisadorNome: string;
    protocolo: string;
    dataAgendada: Date;
  }): Promise<void> {
    const dataFormatada = params.dataAgendada.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const html = buildSchedulingRequestEmailHtml({
      pesquisadorNome: params.pesquisadorNome,
      protocolo: params.protocolo,
      dataAgendada: dataFormatada,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: params.toEmail,
        subject: `LIACLI - Solicitação de Agendamento Recebida`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email de solicitação de agendamento para ${params.toEmail}: ${String(error)}`,
      );
    }
  }

  async sendRejectionEmail(params: {
    toEmail: string;
    pesquisadorNome: string;
    protocolo: string;
    motivoReprovacao: string;
  }): Promise<void> {
    const html = buildRejectionEmailHtml({
      pesquisadorNome: params.pesquisadorNome,
      protocolo: params.protocolo,
      motivoReprovacao: params.motivoReprovacao,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: params.toEmail,
        subject: `LIACLI - Reprovação de Agendamento`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email de reprovação para ${params.toEmail}: ${String(error)}`,
      );
    }
  }

  async sendResultEmail(params: {
    toEmail: string;
    pesquisadorNome: string;
    protocolo: string;
    pdfBuffer: Buffer;
    pdfFileName: string;
  }): Promise<void> {
    const html = buildResultEmailHtml({
      pesquisadorNome: params.pesquisadorNome,
      protocolo: params.protocolo,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: params.toEmail,
        subject: `LIACLI - Laudo Disponível`,
        html,
        attachments: [
          {
            filename: params.pdfFileName,
            content: params.pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email de resultado para ${params.toEmail}: ${String(error)}`,
      );
    }
  }
}
