import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { getMongoDbConfig } from './config/mongo.config';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   host: '127.0.0.1',
    //   port: 27017,
    //   database: 'online-cinema',
    //   useNewUrlParser: true,
    //   autoLoadEntities: true,
    //   useUnifiedTopology: true,
    //   //url: 'mongodb://127.0.0.1:27017/online-cinema',
    //   entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    //   synchronize: true,
    //   logging: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        host: '127.0.0.1',
        port: 27017,
        database: 'online-cinema',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        entities: [User],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
