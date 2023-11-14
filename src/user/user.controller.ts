import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserDec } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  @Auth('admin')
  async getProfile() {
    return this.userService.byId();
  }
  // async getProfile(@UserDec('_id') _id: string) {
  //   console.log(_id);
  //   return this.userService.byId(_id);
  // }
}
