import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entities/user.entity';

export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    //const { user }: { user: User } = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;
    console.log('User:', user);

    if (!user.isAdmin) {
      console.log('Access denied: User is not an admin');
      throw new ForbiddenException('You have no rights!');
    }

    // if (!user.isAdmin) throw new ForbiddenException('You have no rights!');
    console.log('Access granted: User is an admin');
    return user.isAdmin;
  }
}
