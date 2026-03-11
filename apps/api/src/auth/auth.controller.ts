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
  @Post("forgot-password")
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post("reset-password")
  resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.code, body.newPassword);
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth(@Query("mode") mode: string, @Req() req: any) {
    // mode is passed to Google via state parameter by the strategy
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Request() req: any, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || "https://lordlomboministries.com";
    const mode = req.query.state || "login";
    try {
      const result = await this.authService.googleLogin(req.user, mode as "login" | "register");
      res.redirect(
        `${frontendUrl}/connexion?token=${result.accessToken}&role=${result.user.role}`
      );
    } catch (err: any) {
      const code = err?.message || "GOOGLE_ERROR";
      if (code === "GOOGLE_NO_ACCOUNT") {
        res.redirect(`${frontendUrl}/connexion?error=no_account`);
      } else if (code === "GOOGLE_ACCOUNT_EXISTS") {
        res.redirect(`${frontendUrl}/inscription?error=account_exists`);
      } else {
        res.redirect(`${frontendUrl}/connexion?error=google_error`);
      }
    }
  }
}
