import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  // async byId(_id: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { _id },
  //   });

  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }

  async byId() {
    return { email: 'dsfsdf@fas' };
  }
}
