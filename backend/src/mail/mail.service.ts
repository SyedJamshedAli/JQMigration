import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendEmailContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

export interface SendEmailProps {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  content?: SendEmailContent;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT', '465')),
      secure: this.configService.get<string>('SMTP_SECURE', 'true') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail({ to, subject, text, html, content = {} }: SendEmailProps) {
    const { title, subtitle, description, buttonLabel, buttonUrl } = content;

    const emailHtml =
      html ??
      `<!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8" /><title>${subject}</title></head>
        <body style="margin:0;padding:20px 10px;background:#f6f6f6;font-family:Arial,sans-serif;color:#333;">
          <table role="presentation" width="100%" style="background:#f6f6f6;">
            <tr><td align="center">
              <table role="presentation" width="600" style="background:#fff;">
                ${title ? `<tr><td style="padding:20px;text-align:center;"><h1 style="margin:0;font-size:20px;">${title}</h1></td></tr>` : ''}
                ${subtitle ? `<tr><td style="padding:0 20px;text-align:center;"><p style="color:#666;">${subtitle}</p></td></tr>` : ''}
                ${description ? `<tr><td style="padding:10px 20px;"><p>${description}</p></td></tr>` : ''}
                ${buttonLabel && buttonUrl ? `<tr><td style="padding:20px;text-align:center;"><a href="${buttonUrl}" style="background:#4f46e5;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">${buttonLabel}</a></td></tr>` : ''}
              </table>
            </td></tr>
          </table>
        </body>
      </html>`;

    const sender = this.configService.get<string>('SMTP_SENDER', 'Metronic');
    const from = this.configService.get<string>('SMTP_FROM');

    await this.transporter.sendMail({
      from: `${sender} <${from}>`,
      to,
      subject,
      text,
      html: emailHtml,
    });
  }
}
