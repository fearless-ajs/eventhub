import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { appInfo } from '@config/constants';

@Injectable()
export class EmailEngineService {
  private from_email: string = "app.software@plusone.com";
  private readonly appInfo: any;

  constructor(private mailerService: MailerService) {
    const { appEmail, appName, companyName, companyPhone } = appInfo;
    this.appInfo = {
      name: appName,
      email: appEmail,
      companyName: companyName,
      phone: companyPhone
    }

  }

  async sendHtmlEmail(to: string[], subject: string, template: string, payload: any){
    payload.appInfo = this.appInfo;
    await this.mailerService.sendMail({
      to,
      from: this.from_email,
      subject,
      template,
      context: {
        payload: payload
      }
    }).then(res =>{
      // Do something in the future

    }).catch(err =>{
      // Log the error
      console.log(err)
    })
    return true;
  }

}
