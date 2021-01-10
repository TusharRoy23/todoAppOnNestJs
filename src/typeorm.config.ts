import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres-db',
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.POSTGRES_USER || 'postgres',
    database: process.env.POSTGRES_DB || 'tododb',
    entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
    migrationsRun: false,
    logging: true,
    migrationsTableName: "migration",
    migrations: [__dirname + '/migration/**/*.ts', __dirname + '/migration/**/*.js'],
    synchronize: false,
    cli: {
        migrationsDir: 'src/migration'
    }
}

export = typeOrmConfig