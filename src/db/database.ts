import { TypeOrmModule } from '@nestjs/typeorm';
// Entities

export const database = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'mafia-platform-aza-service',
  port: Number(process.env.DB_PORT) || 3000,
  username: 'postgres',
  password: 'd1uNnME6kv6rseSJwXPdunfl',
  database: 'mafia-plbfo_db',
  autoLoadEntities: true,
  synchronize: true,
  ssl: true,
});
