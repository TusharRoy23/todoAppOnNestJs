import {MigrationInterface, QueryRunner} from "typeorm";

export class updateInit1610219787104 implements MigrationInterface {
    name = 'updateInit1610219787104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
    }

}
