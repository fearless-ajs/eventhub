import { registerAs } from '@nestjs/config';

export default registerAs('database', () =>
  process.env.NODE_ENV == 'development' ? localDBConfig() : remoteDBConfig(),
);

const localDBConfig = () => {
  return {
    type: process.env.LOCAL_DB_TYPE,
    host: process.env.LOCAL_DB_HOST || 'localhost',
    port: parseInt(process.env.LOCAL_DB_PORT, 10) || 3306,
    username: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
  };
};

const remoteDBConfig = () => {
  return {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],

    /* CONFIG FOR AUTO MIGRATION TO LIVE SERVER  */
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    /* END OF CONFIG FOR AUTO MIGRATION TO LIVE SERVER  */

    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
  };
};
