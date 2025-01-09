import { TypeOrmModule } from '@nestjs/typeorm';
// Entities

export const database = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'mafia-platform-aza-service',
  port: Number(process.env.DB_PORT) || 5432,
  username: 'postgres',
  password: 'd1uNnME6kv6rseSJwXPd',
  database: 'mafia-plbfo_db',
  autoLoadEntities: true,
  synchronize: true,
});
