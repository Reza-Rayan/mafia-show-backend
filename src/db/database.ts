import { TypeOrmModule } from '@nestjs/typeorm';
// Entities

export const database = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'ep-old-darkness-a594tzky.us-east-2.aws.neon.tech',
  port: Number(process.env.DB_PORT) || 3000,
  username: 'mafia-platform_owner',
  password: 'mUpcOT3zLr4b',
  database: 'mafia-platform',
  autoLoadEntities: true,
  synchronize: true,
  ssl: true,
});
