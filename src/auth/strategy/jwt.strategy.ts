import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: true,
    });
  }

  // async validate({ _id }: Pick<User, '_id'>) {
  //   const user = await this.userRepository.findOne({ where: { _id } });
  //   return user;
  // }
  // async validate(payload: any) {
  //   return {
  //     userId: payload.sub,
  //     email: payload.email,
  //     isAdmin: payload.isAdmin,
  //   };
  // }
  async validate(payload: { sub: number; email: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
