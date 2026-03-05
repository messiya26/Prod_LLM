import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user?.role;
    if (!user || !userRole) throw new ForbiddenException("Acces refuse");
    if (userRole === "SUPER_ADMIN") return true;
    if (!roles.includes(userRole)) {
      throw new ForbiddenException("Acces refuse");
    }
    return true;
  }
}
