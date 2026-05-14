import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Booking } from '../entities/booking.entity';
import { Otp } from '../entities/otp.entity';
import { Payment } from '../entities/payment.entity';
import { Payout } from '../entities/payout.entity';
import { Turf } from '../entities/turf.entity';
import { User } from '../entities/user.entity';

const entities = [ Booking, Otp, Payment, Payout, Turf, User];

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbUrl = configService.get<string>('DB_URL');

  if (dbUrl) {
    return {
      type: 'postgres',
      url: dbUrl,
      entities,
      synchronize: false,
      migrationsRun: false,
      logging: configService.get('NODE_ENV') === 'development',
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  return {
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_NAME') || 'turf_booking',
    entities,
    synchronize: true,
    migrationsRun: false,
    logging: true,
  };
};