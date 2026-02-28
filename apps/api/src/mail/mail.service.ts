import { Injectable, OnModuleInit } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";

const LOGO_SVG_BASE64 = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGMEM3NUUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNENEE0MzgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB4PSIxMCIgeT0iNCIgd2lkdGg9IjExIiBoZWlnaHQ9IjMyIiByeD0iMiIgZmlsbD0idXJsKCNnMSkiLz48cmVjdCB4PSIyNCIgeT0iMTIiIHdpZHRoPSI5IiBoZWlnaHQ9IjI0IiByeD0iMiIgZmlsbD0iIzBEMjI0MCIvPjxwYXRoIGQ9Ik05IDM2IFExOCAzMCwgMjUgMzYgVDQwIDM0IEw0MCAzOSBRMzIgNDIsIDI1IDM5IFQ5IDQxIFoiIGZpbGw9InVybCgjZzEpIi8+PC9zdmc+";

function encodeVerifyToken(token: string): string {
  const payload = Buffer.from(JSON.stringify({ t: token, ts: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", process.env.JWT_SECRET || "ll-academie-secret-dev-2026")
    .update(payload).digest("base64url").slice(0, 16);
  return `${payload}.${sig}`;
}

export function decodeVerifyToken(encoded: string): string | null {
  const [payload, sig] = encoded.split(".");
  if (!payload || !sig) return null;
  const expectedSig = crypto.createHmac("sha256", process.env.JWT_SECRET || "ll-academie-secret-dev-2026")
    .update(payload).digest("base64url").slice(0, 16);
  if (sig !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.t || null;
  } catch {
    return null;
  }
}

@Injectable()
export class MailService implements OnModuleInit {
  private transporter!: nodemailer.Transporter;
  private isEthereal = false;

  async onModuleInit() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log(`[Mail] SMTP configure: ${process.env.SMTP_HOST} (${process.env.SMTP_USER})`);
    } else {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.isEthereal = true;
      console.log(`[Mail] Mode DEV — Ethereal Mail actif`);
      console.log(`[Mail] Visualisez les emails sur: https://ethereal.email/login`);
      console.log(`[Mail] Identifiants: ${testAccount.user} / ${testAccount.pass}`);
    }
  }

  private logPreviewUrl(info: nodemailer.SentMessageInfo) {
    if (this.isEthereal) {
      const url = nodemailer.getTestMessageUrl(info);
      if (url) {
        console.log(`[Mail] Email envoye — Apercu: ${url}`);
      }
    }
  }

  private baseTemplate(content: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lord Lombo Academie</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
          <!-- Header avec Logo -->
          <tr>
            <td style="padding:32px 40px;text-align:center;border-bottom:1px solid rgba(196,167,103,0.2);">
              <img src="data:image/svg+xml;base64,${LOGO_SVG_BASE64}" alt="LL Academie" width="48" height="48" style="display:inline-block;vertical-align:middle;margin-right:12px;" />
              <div style="display:inline-block;vertical-align:middle;">
                <span style="font-size:24px;font-weight:800;color:#C4A767;letter-spacing:2px;">LL</span>
                <span style="font-size:24px;font-weight:300;color:#F5F0E8;letter-spacing:2px;"> ACAD&Eacute;MIE</span>
              </div>
              <p style="margin:8px 0 0;color:rgba(245,240,232,0.4);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Excellence &bull; Formation &bull; Transformation</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;background:linear-gradient(180deg,rgba(196,167,103,0.03) 0%,transparent 100%);">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(196,167,103,0.1);text-align:center;">
              <p style="margin:0 0 8px;color:rgba(245,240,232,0.3);font-size:11px;">
                &copy; ${new Date().getFullYear()} Lord Lombo Acad&eacute;mie &mdash; Tous droits r&eacute;serv&eacute;s
              </p>
              <p style="margin:0;color:rgba(245,240,232,0.2);font-size:10px;">
                Con&ccedil;u par <a href="https://messiyagroup.com" style="color:#C4A767;text-decoration:none;">Messiya Group</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  async sendVerificationEmail(to: string, firstName: string, token: string): Promise<boolean> {
    const encodedToken = encodeVerifyToken(token);
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3001"}/verify?ref=${encodedToken}`;

    const content = `
      <h1 style="margin:0 0 8px;color:#F5F0E8;font-size:24px;font-weight:700;">
        Bienvenue, ${firstName} !
      </h1>
      <p style="margin:0 0 28px;color:rgba(245,240,232,0.5);font-size:14px;line-height:1.6;">
        Merci de rejoindre la communaut&eacute; Lord Lombo Acad&eacute;mie. Pour activer votre compte et acc&eacute;der &agrave; l&rsquo;ensemble de nos formations, veuillez confirmer votre adresse email.
      </p>
      
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyUrl}" style="display:inline-block;padding:16px 48px;background-color:#C4A767;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">
          &#10003; Confirmer mon compte
        </a>
      </div>

      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.1);border-radius:8px;padding:12px 16px;margin-top:24px;">
        <p style="margin:0;color:rgba(245,240,232,0.4);font-size:12px;">
          &#9201; Ce lien expire dans <strong style="color:#F5F0E8;">24 heures</strong>. Si vous n&rsquo;avez pas cr&eacute;&eacute; de compte, ignorez simplement cet email.
        </p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Lord Lombo Academie" <${process.env.SMTP_USER || "noreply@lordlomboacademie.com"}>`,
        to,
        subject: "Confirmez votre compte - Lord Lombo Academie",
        html: this.baseTemplate(content),
      });
      this.logPreviewUrl(info);
      return true;
    } catch (err) {
      console.error("[Mail] Erreur envoi verification:", err);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
    const content = `
      <h1 style="margin:0 0 8px;color:#F5F0E8;font-size:24px;font-weight:700;">
        Compte activ&eacute; avec succ&egrave;s !
      </h1>
      <p style="margin:0 0 28px;color:rgba(245,240,232,0.5);font-size:14px;line-height:1.6;">
        F&eacute;licitations ${firstName}, votre compte est maintenant v&eacute;rifi&eacute;. Vous avez d&eacute;sormais acc&egrave;s &agrave; l&rsquo;ensemble des formations de Lord Lombo Acad&eacute;mie.
      </p>

      <div style="background:rgba(196,167,103,0.06);border:1px solid rgba(196,167,103,0.1);border-radius:12px;padding:24px;margin:24px 0;">
        <h3 style="margin:0 0 16px;color:#C4A767;font-size:15px;font-weight:600;">Vos prochaines &eacute;tapes :</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#128218; Parcourir le catalogue des formations</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#127891; Vous inscrire &agrave; votre premi&egrave;re formation</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#128197; R&eacute;server un cr&eacute;neau de masterclass</td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.FRONTEND_URL || "http://localhost:3001"}/formations" style="display:inline-block;padding:14px 40px;background-color:#C4A767;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">
          D&eacute;couvrir les formations
        </a>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Lord Lombo Academie" <${process.env.SMTP_USER || "noreply@lordlomboacademie.com"}>`,
        to,
        subject: "Bienvenue a Lord Lombo Academie !",
        html: this.baseTemplate(content),
      });
      this.logPreviewUrl(info);
      return true;
    } catch (err) {
      console.error("[Mail] Erreur envoi bienvenue:", err);
      return false;
    }
  }

  async sendAdminInvitation(to: string, inviterName: string, role: string, token: string): Promise<boolean> {
    const encodedToken = encodeVerifyToken(token);
    const acceptUrl = `${process.env.FRONTEND_URL || "http://localhost:3001"}/invitation?ref=${encodedToken}`;
    const roleLabel = role === "ADMIN" ? "Administrateur" : role === "INSTRUCTOR" ? "Formateur" : "Membre";

    const content = `
      <h1 style="margin:0 0 8px;color:#F5F0E8;font-size:24px;font-weight:700;">
        Invitation &agrave; rejoindre l&rsquo;&eacute;quipe
      </h1>
      <p style="margin:0 0 28px;color:rgba(245,240,232,0.5);font-size:14px;line-height:1.6;">
        <strong style="color:#C4A767;">${inviterName}</strong> vous invite &agrave; rejoindre Lord Lombo Acad&eacute;mie en tant que <strong style="color:#C4A767;">${roleLabel}</strong>.
      </p>

      <div style="background:rgba(196,167,103,0.06);border:1px solid rgba(196,167,103,0.1);border-radius:12px;padding:24px;margin:24px 0;">
        <h3 style="margin:0 0 12px;color:#C4A767;font-size:15px;">Vos acc&egrave;s incluront :</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          ${role === "ADMIN" ? `
          <tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#128736; Tableau de bord administrateur complet</td></tr>
          <tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#128100; Gestion des utilisateurs et r&ocirc;les</td></tr>
          <tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#128176; Suivi des paiements et transactions</td></tr>
          ` : `
          <tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#128218; Cr&eacute;ation et gestion de formations</td></tr>
          <tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);font-size:13px;">&#127891; Suivi de vos apprenants</td></tr>
          `}
        </table>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${acceptUrl}" style="display:inline-block;padding:16px 48px;background-color:#C4A767;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">
          Accepter l&rsquo;invitation
        </a>
      </div>

      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.1);border-radius:8px;padding:12px 16px;margin-top:24px;">
        <p style="margin:0;color:rgba(245,240,232,0.4);font-size:12px;">
          &#9201; Cette invitation expire dans <strong style="color:#F5F0E8;">7 jours</strong>.
        </p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Lord Lombo Academie" <${process.env.SMTP_USER || "noreply@lordlomboacademie.com"}>`,
        to,
        subject: `Invitation ${roleLabel} - Lord Lombo Academie`,
        html: this.baseTemplate(content),
      });
      this.logPreviewUrl(info);
      return true;
    } catch (err) {
      console.error("[Mail] Erreur envoi invitation:", err);
      return false;
    }
  }

  async sendBookingConfirmation(to: string, name: string, date: string, slot: string, subject: string): Promise<boolean> {
    const content = `
      <h1 style="margin:0 0 8px;color:#F5F0E8;font-size:24px;font-weight:700;">
        Rendez-vous confirm&eacute; !
      </h1>
      <p style="margin:0 0 28px;color:rgba(245,240,232,0.5);font-size:14px;line-height:1.6;">
        Bonjour ${name}, votre rendez-vous a &eacute;t&eacute; enregistr&eacute; avec succ&egrave;s.
      </p>

      <div style="background:rgba(196,167,103,0.06);border:1px solid rgba(196,167,103,0.1);border-radius:12px;padding:24px;margin:24px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr><td style="padding:8px 0;color:rgba(245,240,232,0.4);font-size:13px;width:100px;">Date</td><td style="padding:8px 0;color:#F5F0E8;font-size:14px;font-weight:600;">${date}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(245,240,232,0.4);font-size:13px;">Heure</td><td style="padding:8px 0;color:#C4A767;font-size:14px;font-weight:600;">${slot}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(245,240,232,0.4);font-size:13px;">Sujet</td><td style="padding:8px 0;color:#F5F0E8;font-size:14px;">${subject}</td></tr>
        </table>
      </div>

      <p style="margin:24px 0 0;color:rgba(245,240,232,0.3);font-size:12px;">
        Si vous souhaitez modifier ou annuler ce rendez-vous, n&rsquo;h&eacute;sitez pas &agrave; nous contacter.
      </p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Lord Lombo Academie" <${process.env.SMTP_USER || "noreply@lordlomboacademie.com"}>`,
        to,
        subject: "Confirmation de rendez-vous - Lord Lombo Academie",
        html: this.baseTemplate(content),
      });
      this.logPreviewUrl(info);
      return true;
    } catch (err) {
      console.error("[Mail] Erreur envoi booking:", err);
      return false;
    }
  }
}
