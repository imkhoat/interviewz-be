import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const getMailerConfig = (configService: ConfigService): MailerOptions => {
  const host = configService.get<string>('MAIL_HOST');
  const port = configService.get<number>('MAIL_PORT');
  const user = configService.get<string>('MAIL_USER');
  const pass = configService.get<string>('MAIL_PASS');
  const from = configService.get<string>('MAIL_FROM');

  return {
    transport: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    }),
    defaults: {
      from,
    },
  };
};
