import { Controller, Post, Get, Body, UseGuards, Request, Req, Res, Query, Param, Put, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Public } from "./guards/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto, @Req() req: any) {
    return this.authService.login(dto, req.ip, req.headers?.["user-agent"]);
  }

  @Public()
  @Get("verify")
  verifyEmail(@Query("ref") ref: string) {
    return this.authService.verifyEmail(ref);
  }

  @Public()
  @Post("resend-verification")
  resendVerification(@Body("email") email: string) {
    return this.authService.resendVerification(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  updateProfile(@Request() req: any, @Body() body: { firstName?: string; lastName?: string; phone?: string }) {
    return this.authService.updateProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put("users/:id/role")
  changeRole(
    @Param("id") userId: string,
    @Body("role") role: "STUDENT" | "INSTRUCTOR" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN",
    @Request() req: any,
  ) {
    return this.authService.changeRole(userId, role, req.user.id);
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Request() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    const frontendUrl = process.env.FRONTEND_URL || "https://lordlomboministries.com";
    res.redirect(
      `${frontendUrl}/connexion?token=${result.accessToken}&role=${result.user.role}`
    );
  }
}
