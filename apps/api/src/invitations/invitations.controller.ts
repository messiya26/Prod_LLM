import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { InvitationsService } from "./invitations.service";

@Controller("invitations")
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  async invite(@Req() req: any, @Body() body: { email: string; role: string }) {
    return this.invitationsService.invite(req.user.id, body.email, body.role);
  }

  @Get()
  async findAll() {
    return this.invitationsService.findAll();
  }

  @Post(":id/resend")
  async resend(@Param("id") id: string) {
    return this.invitationsService.resend(id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.invitationsService.delete(id);
  }

  @Get("token/:token")
  async findByToken(@Param("token") token: string) {
    return this.invitationsService.findByToken(token);
  }

  @Post("token/:token/accept")
  async accept(@Param("token") token: string) {
    return this.invitationsService.accept(token);
  }
}
