import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private svc: CertificatesService) {}

  @Get('my')
  getMy(@Req() req: any) {
    return this.svc.getByUser(req.user.id);
  }

  @Get('verify/:certificateId')
  verify(@Param('certificateId') id: string) {
    return this.svc.verify(id);
  }

  @Post('generate/:enrollmentId')
  generate(@Param('enrollmentId') enrollmentId: string, @Req() req: any) {
    return this.svc.generate(enrollmentId, req.user.id);
  }
}
