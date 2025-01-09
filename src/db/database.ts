import { TypeOrmModule } from '@nestjs/typeorm';
// Entities

export const database = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: 'postgres',
  password: '2wsx3edc',
  database: 'mafia-platform',
  autoLoadEntities: true,
  synchronize: true,
});
