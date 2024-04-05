import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { SESClient, SendEmailCommand, } from '@aws-sdk/client-ses';
import { fromEnv } from "@aws-sdk/credential-providers"
import { Config } from "@/server/config/schema";

@Injectable()
export class MailService {
  sesClient: SESClient;
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly mailerService: MailerService,
  ) { }

  async sendEmail(options: ISendMailOptions) {
    const smtpUrl = this.configService.get("SMTP_URL");

    // If `SMTP_URL` is not set, log the email to the console
    if (!smtpUrl) {
      return Logger.log(options, "MailService#sendEmail");
    }

    return await this.mailerService.sendMail(options);
  }

  createSendEmailCommand = (options: ISendMailOptions) => {
    return new SendEmailCommand({
      Destination: {
        ToAddresses: [options.to?.toString()!],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'TEXT_FORMAT_BODY',
          },
          Text: {
            Charset: 'UTF-8',
            Data: options.text?.toString(),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: options.subject,
        },
      },
      Source: "noreply@noormatch.app",
    });
  };

  async simplyMail(options: ISendMailOptions) {
    const sendEmailCommand = this.createSendEmailCommand(
      options
    );

    try {
      this.sesClient = new SESClient({
        credentials: fromEnv(),
        region: "us-east-1"
      });

      return await this.sesClient.send(sendEmailCommand);
    } catch (e) {
      console.error('Failed to send email.', e);
      return e;
    }
  }
}
