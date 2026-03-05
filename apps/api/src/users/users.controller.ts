import { Controller, Get, Post, Put, Param, Query, Body, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.usersService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("count")
  count() {
    return this.usersService.count();
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("invitations")
  getInvitations() {
    return this.usersService.getInvitations();
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("invite")
  invite(@Body() body: { email: string; role: "INSTRUCTOR" | "ADMIN" }, @Request() req: any) {
    return this.usersService.inviteAdmin(body.email, body.role, req.user.id);
  }

  @Post("accept-invitation")
  acceptInvitation(@Body() body: { token: string }) {
    return this.usersService.acceptInvitation(body.token);
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(":id/role")
  updateRole(@Param("id") id: string, @Body() body: { role: string }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
