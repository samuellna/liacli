import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: (...args: unknown[]) => mockSendMail(...args),
  })),
}));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                MAIL_HOST: 'smtp.gmail.com',
                MAIL_PORT: '587',
                MAIL_SECURE: 'false',
                MAIL_USER: 'test@liacli.ufpe.br',
                MAIL_PASSWORD: 'senha-de-app',
                MAIL_FROM: 'LIACLI <test@liacli.ufpe.br>',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendApprovalEmail', () => {
    it('should call sendMail with correct to, subject, and html', async () => {
      mockSendMail.mockResolvedValue({});

      await service.sendApprovalEmail({
        toEmail: 'pesquisador@ufpe.br',
        pesquisadorNome: 'Samuel',
        protocolo: 'PROTO-123',
        dataAgendada: new Date('2026-07-14'),
      });

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const call = mockSendMail.mock.calls[0][0] as Record<string, unknown>;
      expect(call.to).toBe('pesquisador@ufpe.br');
      expect(call.subject).toContain('PROTO-123');
      expect(call.html).toContain('Agendamento Confirmado');
      expect(call.html).toContain('Samuel');
      expect(call.html).toContain('PROTO-123');
    });

    it('should log error and not throw when sendMail fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP connection refused'));

      await expect(
        service.sendApprovalEmail({
          toEmail: 'pesquisador@ufpe.br',
          pesquisadorNome: 'Samuel',
          protocolo: 'PROTO-123',
          dataAgendada: new Date('2026-07-14'),
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('sendResultEmail', () => {
    it('should call sendMail with to, subject, html, and pdf attachment', async () => {
      mockSendMail.mockResolvedValue({});
      const pdfBuffer = Buffer.from('fake-pdf-content');

      await service.sendResultEmail({
        toEmail: 'pesquisador@ufpe.br',
        pesquisadorNome: 'Samuel',
        protocolo: 'PROTO-123',
        pdfBuffer,
        pdfFileName: 'laudo-PROTO-123.pdf',
      });

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const call = mockSendMail.mock.calls[0][0] as Record<string, unknown>;
      expect(call.to).toBe('pesquisador@ufpe.br');
      expect(call.subject).toContain('PROTO-123');
      expect(call.html).toContain('Laudo Disponível');
      expect(call.html).toContain('Samuel');
      const attachments = call.attachments as Array<Record<string, unknown>>;
      expect(attachments).toHaveLength(1);
      expect(attachments[0].filename).toBe('laudo-PROTO-123.pdf');
      expect(attachments[0].content).toBe(pdfBuffer);
    });

    it('should log error and not throw when sendMail fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP connection refused'));

      await expect(
        service.sendResultEmail({
          toEmail: 'pesquisador@ufpe.br',
          pesquisadorNome: 'Samuel',
          protocolo: 'PROTO-123',
          pdfBuffer: Buffer.from('fake-pdf-content'),
          pdfFileName: 'laudo-PROTO-123.pdf',
        }),
      ).resolves.toBeUndefined();
    });
  });
});
