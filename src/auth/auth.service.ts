import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare, genSalt } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}
  async signup(dto: AuthDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existUser)
      throw new BadRequestException(
        'User with this email is already in the system!'
      );
    try {
      const salt = await genSalt(10);

      const newUser = await this.userRepository.save({
        email: dto.email,
        password: await hash(dto.password, salt),
        isAdmin: false,
        favorites: [],
      });

      const tokens = await this.signTokens(newUser._id);
      return {
        user: this.returnUserFilds(newUser),
        ...tokens,
      };
    } catch (error) {
      throw new Error(error);
    }

    //return this, this.signTokens(newUser._id);
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please signin!');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired!!');

    const user = await this.userRepository.findOne(result.id);

    const tokens = await this.signTokens(user._id);
    return {
      user: this.returnUserFilds(user),
      ...tokens,
    };
  }

  async signin(dto: AuthDto) {
    const user = await this.validatorUser(dto);

    const tokens = await this.signTokens(user._id);

    return {
      user: this.returnUserFilds(user),
      ...tokens,
    };
  }

  async validatorUser(dto: AuthDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async signTokens(userId: string) {
    const data = { _id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });
    return { refreshToken, accessToken };
  }

  returnUserFilds(user: User) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      favorites: user.favorites,
    };
  }
}
