import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SecuritySettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.securitySettings.findUnique({ where: { id: "default" } });
    if (!settings) {
      try {
        settings = await this.prisma.securitySettings.create({ data: { id: "default" } });
      } catch {
        settings = await this.prisma.securitySettings.findUnique({ where: { id: "default" } });
      }
    }
    return settings;
  }

  async update(data: any) {
    return this.prisma.securitySettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });
  }

  async validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
    const settings = await this.get();
    const errors: string[] = [];
    if (!settings) return { valid: true, errors };

    if (password.length < settings.passwordMinLength)
      errors.push(`Le mot de passe doit contenir au moins ${settings.passwordMinLength} caracteres`);
    if (settings.passwordRequireUpper && !/[A-Z]/.test(password))
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    if (settings.passwordRequireLower && !/[a-z]/.test(password))
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    if (settings.passwordRequireNumber && !/[0-9]/.test(password))
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    if (settings.passwordRequireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Le mot de passe doit contenir au moins un caractere special");

    return { valid: errors.length === 0, errors };
  }
}
