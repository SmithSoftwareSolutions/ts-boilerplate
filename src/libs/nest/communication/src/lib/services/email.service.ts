import { Injectable } from '@nestjs/common';
import { MailService, ResponseError } from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private sendGridClient: MailService;

  constructor() {
    this.sendGridClient = new MailService();
    this.sendGridClient.setApiKey(process.env['SENDGRID_API_KEY']!);
  }

  sendHTMLEmail(to: string, subject: string, content: string) {
    return this.sendGridClient.send(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: process.env['COMMUNICATIONS_FROM_EMAIL']!,
        to,
        subject,
        html: content,
      },
      false,
      (e) => this.handleSendError('Reset Password', e)
    );
  }

  sendResetPasswordEmail(email: string, resetPasswordLink: string) {
    return this.sendGridClient.send(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: process.env['COMMUNICATIONS_FROM_EMAIL']!,
        templateId: 'd-5f3bc819a40c4351b3b2f16b9d2a47a9',
        dynamicTemplateData: { resetPasswordLink },
        to: email,
      },
      false,
      (e) => this.handleSendError('Reset Password', e)
    );
  }

  sendNewUserAccountEmail(email: string, password: string) {
    return this.sendGridClient.send(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: process.env['COMMUNICATIONS_FROM_EMAIL']!,
        templateId: 'd-2947ce6bae2f482aa0054235abea838a',
        dynamicTemplateData: { email, password },
        to: email,
      },
      false,
      (e) => this.handleSendError('New User Account', e)
    );
  }

  protected handleSendError(emailName: string, e: Error | Response | null) {
    if (e) {
      console.log(
        `Failed to Send ${emailName} Email: ${(e as ResponseError).code}`,
        (e as ResponseError).message
      );

      if ((e as ResponseError).response?.body) {
        console.log((e as ResponseError).response.body);
      }
    }
  }
}
