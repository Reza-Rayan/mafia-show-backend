import { TypeOrmModule } from '@nestjs/typeorm';

export const database = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: 'postgres',
  password: '2wsx3edc',
  database: process.env.DB_NAME || 'mafia-platform',
  autoLoadEntities: true,
  synchronize: true,
});
