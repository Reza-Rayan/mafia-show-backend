export const config = () => ({
  port: process.env.PORT || 3000,
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || 5432,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWRD,
});
