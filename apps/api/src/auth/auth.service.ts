import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { PrismaService } from "../prisma";
import { MailService, decodeVerifyToken } from "../mail/mail.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("Cet email est deja utilise");

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        emailVerified: false,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await this.prisma.verificationToken.create({
      data: {
        token,
        email: user.email,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    this.mail.sendVerificationEmail(user.email, user.firstName, token).catch(() => {});

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: false },
      ...tokens,
      message: "Un email de verification a ete envoye a votre adresse.",
    };
  }

  async verifyEmail(encodedRef: string) {
    const rawToken = decodeVerifyToken(encodedRef);
    if (!rawToken) throw new BadRequestException("Lien de verification invalide ou corrompu");

    const record = await this.prisma.verificationToken.findUnique({ where: { token: rawToken } });

    if (!record) throw new BadRequestException("Lien de verification invalide");
    if (record.used) throw new BadRequestException("Ce lien a deja ete utilise");
    if (record.expiresAt < new Date()) throw new BadRequestException("Ce lien a expire. Veuillez demander un nouveau lien.");

    await this.prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } });

    const user = await this.prisma.user.update({
      where: { email: record.email },
      data: { emailVerified: true },
    });

    this.mail.sendWelcomeEmail(user.email, user.firstName).catch(() => {});

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: true },
      ...tokens,
      message: "Votre compte a ete verifie avec succes !",
    };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException("Aucun compte associe a cet email");
    if (user.emailVerified) throw new BadRequestException("Cet email est deja verifie");

    await this.prisma.verificationToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await this.prisma.verificationToken.create({
      data: {
        token,
        email,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    this.mail.sendVerificationEmail(email, user.firstName, token).catch(() => {});
    return { message: "Un nouveau lien de verification a ete envoye." };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Email ou mot de passe incorrect");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Email ou mot de passe incorrect");

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: user.emailVerified },
      ...tokens,
    };
  }

  async googleLogin(googleUser: { email: string; firstName: string; lastName: string; avatar: string | null }) {
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 12);
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.avatar,
          passwordHash,
          emailVerified: true,
        },
      });

      this.mail.sendWelcomeEmail(user.email, user.firstName).catch(() => {});
    } else if (!user.emailVerified) {
      await this.prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: true },
      ...tokens,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, emailVerified: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const updateData: any = {};
    if (data.firstName?.trim()) updateData.firstName = data.firstName.trim();
    if (data.lastName?.trim()) updateData.lastName = data.lastName.trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim() || null;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, emailVerified: true, createdAt: true },
    });
    return user;
  }

  async promoteToAdmin(userId: string, currentUserId: string) {
    const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser || currentUser.role !== "ADMIN") throw new UnauthorizedException("Seul un admin peut promouvoir un utilisateur");

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  }

  async changeRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN", currentUserId: string) {
    const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN")) throw new UnauthorizedException("Seul un admin peut modifier les roles");

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { expiresIn: "1d" }),
      this.jwt.signAsync(payload, { expiresIn: "7d" }),
    ]);
    return { accessToken, refreshToken };
  }
}
