import nodemailer from 'nodemailer';
import { config } from '../config/config';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendAccountDeletionEmail(to: string, confirmationLink: string): Promise<void> {
    const mailOptions = {
      from: `"StopBet" <${config.email.user}>`,
      to,
      subject: 'Confirmação de Exclusão de Conta - StopBet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #d32f2f;">Confirmação de Exclusão de Conta</h2>
          <p>Você solicitou a exclusão da sua conta na plataforma StopBet.</p>
          <p>Esta ação <strong>não pode ser desfeita</strong> e resultará na exclusão permanente de todos os seus dados.</p>
          <p>Se você realmente deseja excluir sua conta, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirmar Exclusão da Conta</a>
          </div>
          <p>Se você não solicitou esta ação, por favor ignore este email ou entre em contato com nosso suporte.</p>
          <p>Este link expirará em 24 horas.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #757575;">StopBet - Ajudando você a controlar seus hábitos de apostas</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
} 