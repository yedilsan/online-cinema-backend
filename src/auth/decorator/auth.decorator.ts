import { UseGuards, applyDecorators } from '@nestjs/common';
import { TypeRole } from '../auth.interface';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { AdminGuard } from '../guard/admin.guard';

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, AdminGuard)
      : UseGuards(JwtAuthGuard)
  );
