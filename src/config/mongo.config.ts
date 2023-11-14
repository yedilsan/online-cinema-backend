import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const getMongoDbConfig = async (
  configService: ConfigService
): Promise<TypeOrmModule> => ({
  uri: configService.get('MONGO_URI'),
});
